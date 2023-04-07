import { Request, Response } from "express";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorTestimonial from "../models/TutorTestimonial";
import HttpError from "../../errors/HttpError";

require("express-async-errors");
export const getTestimonials = async (req: Request, res: Response) => {
  // retrieve options
  const profileId = req.query.profileId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const filter: { tutorProfile?: any; author?: any } = {
    tutorProfile: new ObjectId(profileId as string),
  };
  if (req.session.userId) {
    // if logged in, leave out author
    filter.author = { $ne: new ObjectId(req.session.userId) };
  }

  const totalCount = await collections.tutorTestimonials!.countDocuments(
    filter
  );
  const documents = await collections
    .tutorTestimonials!.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "user",
          localField: "author",
          foreignField: "_id",
          as: "authorName",
        },
      },
      {
        $set: {
          authorName: { $arrayElemAt: ["$authorName.name", 0] },
        },
      },
      { $sort: { _id: -1 } },
    ])
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert documents into objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const testimonials = [];
  for (const doc of documents) {
    const testimonial = TutorTestimonial.assign(doc as TutorTestimonial);
    testimonials.push(testimonial);
  }

  res.json({ testimonials, count: totalCount });
};

export const getUserTestimonials = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const filter = { author: new ObjectId(req.user?._id) };
  const totalCount = await collections.tutorTestimonials!.countDocuments(
    filter
  );
  const documents = await collections
    .tutorTestimonials!.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "tutorProfiles",
          localField: "tutorProfile",
          foreignField: "_id",
          as: "tutorProfile",
        },
      },
      {
        $unwind: "$tutorProfile",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          testimonial: 1,
          "tutorProfile.urlId": 1,
          "tutorProfile.tutorName": 1,
        },
      },
      { $sort: { _id: -1 } },
    ])
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert documents into objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const testimonials = [];
  for (const doc of documents) {
    const testimonial = TutorTestimonial.assign(doc as TutorTestimonial);
    testimonials.push(testimonial);
  }

  res.json({ testimonials, count: totalCount });
};

export const postTestimonial = async (req: Request, res: Response) => {
  const user = req.user!;

  // cannot leave testimonial for yourself
  const profile = await collections.tutorProfiles!.findOne({
    _id: new ObjectId(req.body.tutorProfile),
    owner: user._id,
  });
  if (profile) {
    throw new HttpError(403, "Cannot leave testimonial for yourself");
  }

  // no duplicate testimonial
  const testimonial = await collections.tutorTestimonials!.findOne({
    tutorProfile: new ObjectId(req.body.tutorProfile),
    author: user._id!,
  });
  if (testimonial) {
    throw new HttpError(403, "Testimonial already exists");
  }

  // create profile object
  const newObject = new TutorTestimonial();
  Object.assign(newObject, req.body);
  newObject.tutorProfile = new ObjectId(req.body.tutorProfile);
  newObject.author = user._id!;

  await collections.tutorTestimonials!.insertOne(newObject);
  collections.tutorProfiles!.updateOne(
    // no need for async
    { _id: newObject.tutorProfile },
    { $inc: { testimonialCount: 1 } }
  );

  res.status(201).json({});
};

export const testimonialExists = async (req: Request, res: Response) => {
  const user = req.user!;
  const profileId = req.query.profileId;

  const document = await collections.tutorTestimonials!.findOne({
    tutorProfile: new ObjectId(profileId as string),
    author: user._id!,
  });

  if (!document) {
    res.json({ testimonial: null });
    return;
  }

  const testimonial = TutorTestimonial.assign(document as TutorTestimonial);

  res.json({ testimonial });
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const result = await collections.tutorTestimonials?.findOneAndDelete({
    _id: new ObjectId(id),
    author: user._id,
  });

  if (!result?.ok || !result.value) {
    throw new HttpError(400, "Could not delete testimonial");
  }

  if (result.value.tutorProfile) {
    collections.tutorProfiles!.updateOne(
      // decrement, no need for async
      { _id: result.value.tutorProfile },
      { $inc: { testimonialCount: -1 } }
    );
  }

  res.status(202).json({});
};

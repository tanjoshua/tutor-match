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

  const filter = { tutorProfile: new ObjectId(profileId as string) };
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

export const postTestimonial = async (req: Request, res: Response) => {
  const user = req.user!;

  // no duplicate testimonial
  const testimonial = await collections.tutorTestimonials!.findOne({
    tutorProfile: req.body.tutorProfile,
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

  await collections.tutorTestimonials?.insertOne(newObject);

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
  }

  const testimonial = TutorTestimonial.assign(document as TutorTestimonial);

  res.json({ testimonial });
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const result = await collections.tutorTestimonials?.deleteOne({
    _id: new ObjectId(id),
    author: user._id,
  });

  if (result?.deletedCount === 0) {
    throw new HttpError(400, "Could not delete testimonial");
  }

  res.status(202).json({});
};

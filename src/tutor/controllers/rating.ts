import { Request, Response } from "express";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorRating from "../models/TutorRating";
import HttpError from "../../errors/HttpError";
import uniqid from "uniqid";
import RatingRequest from "../models/RatingRequest";
import { sendEmail } from "../../services/email.service";
import { generateRatingRequestEmail } from "../../utils/emailFactory";

require("express-async-errors");
export const getRatings = async (req: Request, res: Response) => {
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

  const totalCount = await collections.tutorRatings!.countDocuments(filter);
  const documents = await collections
    .tutorRatings!.aggregate([
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
  const ratings = [];
  for (const doc of documents) {
    const rating = TutorRating.assign(doc as TutorRating);
    ratings.push(rating);
  }

  res.json({ ratings, count: totalCount });
};

export const getUserRatings = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const filter = { author: new ObjectId(req.user?._id) };
  const totalCount = await collections.tutorRatings!.countDocuments(filter);
  const documents = await collections
    .tutorRatings!.aggregate([
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
          rating: 1,
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
  const ratings = [];
  for (const doc of documents) {
    const rating = TutorRating.assign(doc as TutorRating);
    ratings.push(rating);
  }

  res.json({ ratings, count: totalCount });
};

export const postRating = async (req: Request, res: Response) => {
  const user = req.user!;

  // cannot leave rating for yourself
  const profile = await collections.tutorProfiles!.findOne({
    _id: new ObjectId(req.body.tutorProfile),
    owner: user._id,
  });
  if (profile) {
    throw new HttpError(403, "Cannot leave rating for yourself");
  }

  // no duplicate rating
  const rating = await collections.tutorRatings!.findOne({
    tutorProfile: new ObjectId(req.body.tutorProfile),
    author: user._id!,
  });
  if (rating) {
    throw new HttpError(403, "Rating already exists");
  }

  // create rating object
  const newObject = new TutorRating();
  Object.assign(newObject, req.body);
  newObject.tutorProfile = new ObjectId(req.body.tutorProfile);
  newObject.author = user._id!;

  await collections.tutorRatings!.insertOne(newObject);
  collections.tutorProfiles!.updateOne(
    // no need for async
    { _id: newObject.tutorProfile },
    { $inc: { ratingCount: 1, totalRating: newObject.rating } }
  );

  res.status(201).json({});
};

export const ratingExists = async (req: Request, res: Response) => {
  const user = req.user!;
  const profileId = req.query.profileId;

  const document = await collections.tutorRatings!.findOne({
    tutorProfile: new ObjectId(profileId as string),
    author: user._id!,
  });

  if (!document) {
    res.json({ rating: null });
    return;
  }

  const rating = TutorRating.assign(document as TutorRating);

  res.json({ rating });
};

export const deleteRating = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const result = await collections.tutorRatings?.findOneAndDelete({
    _id: new ObjectId(id),
    author: user._id,
  });

  if (!result?.ok || !result.value) {
    throw new HttpError(400, "Could not delete rating");
  }

  if (result.value.tutorProfile) {
    collections.tutorProfiles!.updateOne(
      // decrement, no need for async
      { _id: result.value.tutorProfile },
      { $inc: { ratingCount: -1, totalRating: -result.value.rating } }
    );
  }

  res.status(202).json({});
};

export const requestRating = async (req: Request, res: Response) => {
  const user = req.user!;
  const { email, message } = req.body;

  // cannot send email to yourself
  if (user.email === email) {
    throw new HttpError(400, "Cannot request rating from yourself");
  }

  // user has tutorprofile
  const tutorProfile = await collections.tutorProfiles!.findOne({
    owner: user._id,
  });
  if (!tutorProfile) {
    throw new HttpError(404, "Tutor profile not found");
  }

  // no duplicate rating requests
  const duplicateRatingRequest = await collections.ratingRequests!.findOne({
    tutorProfile: tutorProfile._id,
    email,
  });
  if (duplicateRatingRequest) {
    throw new HttpError(
      400,
      "You've already sent a rating request to this person"
    );
  }

  // no duplicate ratings, from both requested and account ratings
  const userAccount = await collections.users!.findOne({
    email: email,
  });
  if (userAccount) {
    const rating = await collections.tutorRatings!.findOne({
      tutorProfile: tutorProfile._id,
      author: userAccount._id,
    });
    if (rating) {
      throw new HttpError(403, "Rating already exists");
    }
  }

  const rating = await collections.tutorRatings!.findOne({
    tutorProfile: tutorProfile._id,
    authorEmail: email!,
  });
  if (rating) {
    throw new HttpError(403, "Rating already exists");
  }

  // create rating request
  const token = uniqid();
  const ratingRequest = new RatingRequest();
  ratingRequest.token = token;
  ratingRequest.email = email;
  ratingRequest.message = message;
  ratingRequest.tutorProfile = tutorProfile._id;
  await collections.ratingRequests!.insertOne(ratingRequest);

  // send email
  sendEmail(
    generateRatingRequestEmail({
      token,
      tutorName: tutorProfile.tutorName,
      recipientEmail: email,
      message: message,
    })
  );

  res.status(201).json({ message: "Request sent" });
};

export const verifyRatingRequest = async (req: Request, res: Response) => {
  // TODO: if user is logged in, should we redirect them?
  const { token } = req.body;
  const ratingRequest = await collections.ratingRequests!.findOne({ token });

  if (!ratingRequest) {
    throw new HttpError(404, "Rating request not found");
  }

  res.json({});
};

export const fulfilRatingRequest = async (req: Request, res: Response) => {
  const { token, rating, testimonial, name } = req.body;

  const ratingRequest = await collections.ratingRequests!.findOne({ token });
  if (!ratingRequest) {
    throw new HttpError(404, "Rating request not found");
  }

  // no duplicate ratings, from both requested and verified account ratings
  const userAccount = await collections.users!.findOne({
    email: ratingRequest.email,
  });
  if (userAccount) {
    const rating = await collections.tutorRatings!.findOne({
      tutorProfile: ratingRequest.tutorProfile,
      author: userAccount._id,
    });
    if (rating) {
      throw new HttpError(403, "Rating already exists");
    }
  }
  const duplicateRating = await collections.tutorRatings!.findOne({
    tutorProfile: ratingRequest.tutorProfile,
    authorEmail: ratingRequest.email,
  });
  if (duplicateRating) {
    throw new HttpError(403, "Rating already exists");
  }

  // get tutor profile
  const tutorProfile = await collections.tutorProfiles?.findOne({
    _id: new ObjectId(req.body.tutorProfile),
  });
  if (!tutorProfile) {
    throw new HttpError(404, "Tutor profile not found");
  }

  // create rating
  const newObject = new TutorRating();
  newObject.tutorProfile = new ObjectId(req.body.tutorProfile);
  if (userAccount) {
    // if email already has account, register rating under their account
    newObject.author = userAccount._id;
  } else {
    newObject.authorEmail = ratingRequest.email;
    newObject.noAccountAuthorName = name;
  }
  newObject.rating = rating;
  newObject.testimonial = testimonial;
  await collections.tutorRatings!.insertOne(newObject);
  collections.tutorProfiles!.updateOne(
    // no need for async
    { _id: newObject.tutorProfile },
    { $inc: { ratingCount: 1, totalRating: newObject.rating } }
  );

  // delete rating request
  await collections.ratingRequests!.deleteOne({ token });

  res.json({ message: "Rating successful", tutorUrlId: tutorProfile.urlId });
};

import { Request, Response } from "express";

import HttpError from "../../errors/HttpError";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorProfile from "../models/Profile";

require("express-async-errors");
export const getPublicProfiles = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  // only process public profiles
  const searchQuery: any[] = [{ isPublic: true }];

  // process search query
  if (req.query.search) {
    searchQuery.push({
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { subjects: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }

  // consolidate filters
  const filter = { $and: searchQuery };

  const totalCount = await collections.tutorProfiles!.countDocuments(filter);
  const profileDocuments = await collections
    .tutorProfiles!.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "user",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $unwind: {
          // flattens ownerDetails array into 1
          path: "$ownerDetails",
        },
      },
    ])
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert invoice documents into invoice objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const profiles = [];
  for (const doc of profileDocuments) {
    const profile = TutorProfile.assign(doc as TutorProfile);
    profiles.push(profile);
  }

  res.json({ profiles, count: totalCount });
};

export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const profileDocument = await collections.tutorProfiles
    ?.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "user",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $unwind: {
          // flattens ownerDetails array into 1
          path: "$ownerDetails",
        },
      },
    ])
    .next();
  if (!profileDocument) {
    throw new HttpError(404, "Profile not found");
  }
  const profile = TutorProfile.assign(profileDocument as TutorProfile);

  res.json({ profile });
};

export const createProfile = async (req: Request, res: Response) => {
  const owner = req.user!;

  // create profile object
  const profile = new TutorProfile();
  profile.owner = owner._id!;
  Object.assign(profile, req.body); // TODO: check

  const result = await collections.tutorProfiles?.insertOne(profile);

  res.status(201).json(result);
};

export const replaceProfile = async (req: Request, res: Response) => {
  const id = req.body.id;
  const profile = await collections.tutorProfiles!.findOne({
    _id: new ObjectId(id),
  });
  if (!profile) {
    throw new HttpError(404, "Profile not found");
  }

  // updated fields
  Object.assign(profile, req.body); // TODO: check

  const result = await collections.tutorProfiles!.replaceOne(
    { _id: new ObjectId(id) },
    profile
  );
  res.json(result);
};

export const deleteProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await collections.tutorProfiles!.deleteOne({
    _id: new ObjectId(id),
  });

  if (!result.deletedCount) {
    throw new HttpError(404, "Profile not found");
  }

  res.status(202).json();
};

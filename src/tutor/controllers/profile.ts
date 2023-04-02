import { Request, Response } from "express";

import HttpError from "../../errors/HttpError";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorProfile, { Level } from "../models/TutorProfile";
import { removeProfilePic } from "../../services/s3.service";

enum ProfileSortBy {
  Oldest = "Oldest",
  Newest = "Newest",
  LowestRate = "Lowest Rate",
  HighestRate = "Highest Rate",
}

require("express-async-errors");
export const getPublicProfiles = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.body.page || 1;
  const limit = req.body.limit || 5;

  // only process public profiles
  const filters: any[] = [{ isPublic: true }];

  // process search query
  if (req.body.search) {
    const searchFilters: any = [
      { tutorName: { $regex: req.body.search, $options: "i" } },
      { title: { $regex: req.body.search, $options: "i" } },
      { subjects: { $regex: req.body.search, $options: "i" } },
      { qualifications: { $regex: req.body.search, $options: "i" } },
      { description: { $regex: req.body.search, $options: "i" } },
    ];
    filters.push({
      $or: searchFilters,
    });
  }
  if (req.body.regions?.length > 0)
    filters.push({ regions: { $in: req.body.regions } });
  if (req.body.gender?.length === 1)
    filters.push({ gender: req.body.gender[0] });
  if (req.body.type?.length > 0) filters.push({ type: { $in: req.body.type } });
  if (req.body.levelCategories?.length > 0) {
    const levelFilters: any[] = [];
    for (const levelCategory of req.body.levelCategories) {
      const filter: { levels?: any; allSubjects?: any } = {
        levels: levelCategory,
      };
      if (req.body.subjects && req.body.subjects[levelCategory]?.length > 0)
        filter.allSubjects = { $in: req.body.subjects[levelCategory] };
      levelFilters.push(filter);
    }
    filters.push({ $or: levelFilters });
  }

  // handle sort
  let sort: any = { _id: 1 };
  if (req.body.sortBy) {
    if (req.body.sortBy === ProfileSortBy.Newest) {
      sort = { _id: -1 };
    } else if (req.body.sortBy === ProfileSortBy.HighestRate) {
      sort = { "pricing.rate": -1 };
    } else if (req.body.sortBy === ProfileSortBy.LowestRate) {
      sort = { "pricing.rate": 1 };
    }
  }

  // consolidate filters
  const filter: { $and?: any } = {};
  if (filters.length > 0) filter.$and = filters;

  const totalCount = await collections.tutorProfiles!.countDocuments(filter);
  let profileDocuments = await collections
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
      { $sort: sort },
    ])
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert documents into objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const profiles = [];
  for (const doc of profileDocuments) {
    const profile = TutorProfile.assign(doc as TutorProfile);
    profiles.push(profile);
  }

  res.json({ profiles, count: totalCount });
};

export const getProfile = async (req: Request, res: Response) => {
  const { urlId } = req.params;

  const profileDocument = await collections.tutorProfiles
    ?.aggregate([
      { $match: { urlId: urlId as string } },
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
  const profile = TutorProfile.assign(req.body);
  profile.owner = owner._id!;

  // check if unique url id is available
  const clashingProfile = await collections.tutorProfiles!.findOne({
    urlId: req.body.urlId,
  });
  if (clashingProfile) {
    throw new HttpError(409, "URL already in use");
  }

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

  // check if unique url id is available
  const clashingProfile = await collections.tutorProfiles!.findOne({
    urlId: req.body.urlId,
    _id: { $ne: new ObjectId(id) },
  });
  if (clashingProfile) {
    throw new HttpError(409, "URL already in use");
  }

  // updated fields
  Object.assign(profile, req.body); // TODO: check
  const newProfile = TutorProfile.assign(profile);

  const result = await collections.tutorProfiles!.replaceOne(
    { _id: new ObjectId(id) },
    newProfile
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

export const getUserTutorProfile = async (req: Request, res: Response) => {
  const owner = req.user!;
  const result = await collections.tutorProfiles!.findOne({
    owner: new ObjectId(owner._id),
  });

  res.json({ profile: result });
};

export const getTutorLevels = async (_req: Request, res: Response) => {
  res.json({
    levels: Object.values(Level),
  });
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const owner = req.user!;
  const profileDocument = await collections.tutorProfiles!.findOne({
    owner: new ObjectId(owner._id),
  });
  const file = req.file as any;

  if (!profileDocument) {
    /// delete image
    if (file) removeProfilePic(file);
    throw new HttpError(404, "Profile not found");
  }

  if (!file) {
    throw new HttpError(500, "Upload failed");
  }

  const oldKey = profileDocument.profilePic?.key;
  await collections.tutorProfiles?.updateOne(
    { owner: new ObjectId(owner._id) },
    {
      $set: {
        profilePic: {
          key: file.key,
          location: file.location,
        },
      },
    }
  );

  // remove old profile pic if necessary
  if (oldKey) removeProfilePic(oldKey);

  res.json({ key: file.key, location: file.location });
};

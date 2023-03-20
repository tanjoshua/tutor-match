import { Request, Response } from "express";
import uniqid from "uniqid";

import HttpError from "../../errors/HttpError";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorRequest from "../models/TutorRequest";
import TutorApplication, { ApplicationState } from "../models/TutorApplication";
import { sendEmail } from "../../services/email.service";
import { generateNewTutorRequestEmail } from "../../utils/emailFactory";

require("express-async-errors");
export const getTutorRequests = async (req: Request, res: Response) => {
  const tutor = req.user!;
  // retrieve options
  const page = req.body.page || 1;
  const limit = req.body.limit || 5;

  // filter
  const filters: any[] = [];

  if (req.body.region?.length > 0)
    filters.push({ region: { $in: req.body.region } });
  if (req.body.gender) filters.push({ gender: req.body.gender });
  if (req.body.type?.length > 0) filters.push({ type: { $in: req.body.type } });
  if (req.body.levelCategories?.length > 0) {
    const levelFilters: any[] = [];
    for (const levelCategory of req.body.levelCategories) {
      const filter: { levelCategory?: any; subjects?: any } = {
        levelCategory: levelCategory,
      };
      if (req.body.subjects && req.body.subjects[levelCategory]?.length > 0)
        filter.subjects = { $in: req.body.subjects[levelCategory] };
      levelFilters.push(filter);
    }
    filters.push({ $or: levelFilters });
  }

  const filter: { $and?: any } = {};
  if (filters.length > 0) filter.$and = filters;

  const totalCount = await collections.tutorRequests!.countDocuments(filter);
  const documents = await collections
    .tutorRequests!.aggregate([{ $match: filter }, { $sort: { _id: -1 } }])
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert documents into objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const objects = [];
  for (const doc of documents) {
    const object = TutorRequest.assign(doc as TutorRequest);
    const tutorApp = await collections.tutorApplications!.findOne({
      tutorRequest: object._id,
      tutor: tutor._id,
    });
    objects.push({ ...object, applied: !!tutorApp });
  }

  res.json({ tutorRequests: objects, count: totalCount });
};

export const getAppliedRequests = async (req: Request, res: Response) => {
  const tutor = req.user!;
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const totalCount = await collections.tutorApplications!.countDocuments({
    tutor: new ObjectId(tutor._id),
  });
  const applications = await collections
    .tutorApplications!.aggregate([
      {
        $match: {
          tutor: new ObjectId(tutor._id),
        },
      },
      {
        $lookup: {
          from: "tutorRequests",
          localField: "tutorRequest",
          foreignField: "_id",
          as: "tutorRequestDetails",
        },
      },
      {
        $unwind: {
          path: "$tutorRequestDetails",
        },
      },
      {
        $addFields: {
          "tutorRequestDetails.applied": true,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();
  res.json({ applications, count: totalCount });
};

export const getTutorRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const document = await collections.tutorRequests
    ?.aggregate([
      { $match: { _id: new ObjectId(id) } },
      // add stuff in the future
    ])
    .next();
  if (!document) {
    throw new HttpError(404, "Not found");
  }
  const object = TutorRequest.assign(document as TutorRequest);

  res.json({ tutorRequest: object });
};

export const createTutorRequest = async (req: Request, res: Response) => {
  // create profile object
  const newObject = new TutorRequest();
  Object.assign(newObject, req.body);

  // generate uniqid for client access token
  const clientAccessToken = uniqid();
  newObject.clientAccessToken = clientAccessToken;

  await collections.tutorRequests?.insertOne(newObject);

  // send email (no need to wait)
  sendEmail(
    generateNewTutorRequestEmail(
      newObject.name,
      newObject.contactInfo.email,
      clientAccessToken
    )
  );

  res.status(201).json({ clientAccessToken });
};

export const replaceTutorRequest = async (req: Request, res: Response) => {
  const id = req.body.id;
  const document = await collections.tutorRequests!.findOne({
    _id: new ObjectId(id),
  });
  if (!document) {
    throw new HttpError(404, "Not found");
  }

  // updated fields
  Object.assign(document, req.body); // TODO: check

  const result = await collections.tutorRequests!.replaceOne(
    { _id: new ObjectId(id) },
    document
  );
  res.json(result);
};

export const deleteTutorRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await collections.tutorRequests!.deleteOne({
    _id: new ObjectId(id),
  });

  if (!result.deletedCount) {
    throw new HttpError(404, "Not found");
  }

  res.status(202).json();
};

export const applyToTutorRequest = async (req: Request, res: Response) => {
  const id = req.body.id;
  const owner = req.user!;

  const document = await collections.tutorRequests!.findOne({
    _id: new ObjectId(id),
  });
  if (!document) {
    throw new HttpError(404, "Not found");
  }

  // create new application document
  const tutorApp = new TutorApplication();
  tutorApp.tutor = owner._id!;
  tutorApp.tutorRequest = new ObjectId(id);
  const result = await collections.tutorApplications!.insertOne(tutorApp);

  // insert application into list
  await collections.tutorRequests!.updateOne(
    { _id: new ObjectId(id) },
    { $push: { applicants: result.insertedId } }
  );

  res.json();
};

export const withdrawApplication = async (req: Request, res: Response) => {
  const id = req.body.id;
  const owner = req.user!;

  // delete application
  const tutorApp = await collections.tutorApplications!.findOne({
    tutorRequest: new ObjectId(id),
    tutor: owner._id!,
  });

  if (tutorApp) {
    await collections.tutorApplications!.deleteOne({
      tutorRequest: new ObjectId(id),
      tutor: owner._id!,
    });

    await collections.tutorRequests!.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $pull: { applicants: tutorApp._id } }
    );
  }

  // note: will not throw error if doesn't exist
  res.json();
};

export const tutorHasApplied = async (req: Request, res: Response) => {
  const id = req.query.id;
  const owner = req.user!;

  const tutorApp = await collections.tutorApplications!.findOne({
    tutorRequest: new ObjectId(id as string),
    tutor: owner._id!,
  });

  res.json({ hasApplied: !!tutorApp });
};

export const getTutorApplications = async (req: Request, res: Response) => {
  const token = req.query.token;

  const tutorRequest = await collections.tutorRequests!.findOne({
    clientAccessToken: token,
  });
  if (!tutorRequest) {
    throw new HttpError(404, "Not found");
  }

  const pendingApplications = await collections
    .tutorApplications!.aggregate([
      {
        $match: {
          tutorRequest: new ObjectId(tutorRequest._id),
          state: ApplicationState.Pending,
        },
      },
      {
        $lookup: {
          from: "tutorProfiles",
          localField: "tutor",
          foreignField: "owner",
          as: "tutorProfile",
        },
      },
      {
        $unwind: {
          // this also removes applications with no tutor profile
          path: "$tutorProfile",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();
  const hiddenApplications = await collections
    .tutorApplications!.aggregate([
      {
        $match: {
          tutorRequest: new ObjectId(tutorRequest._id),
          state: ApplicationState.Hidden,
        },
      },
      {
        $lookup: {
          from: "tutorProfiles",
          localField: "tutor",
          foreignField: "owner",
          as: "tutorProfile",
        },
      },
      {
        $unwind: {
          path: "$tutorProfile",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();
  const shortlistedApplications = await collections
    .tutorApplications!.aggregate([
      {
        $match: {
          tutorRequest: new ObjectId(tutorRequest._id),
          state: ApplicationState.Shortlisted,
        },
      },
      {
        $lookup: {
          from: "tutorProfiles",
          localField: "tutor",
          foreignField: "owner",
          as: "tutorProfile",
        },
      },
      {
        $unwind: {
          path: "$tutorProfile",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();

  res.json({
    pendingApplications,
    hiddenApplications,
    shortlistedApplications,
    tutorRequest,
  });
};

export const updateTutorApplicationState = async (
  req: Request,
  res: Response
) => {
  const id = req.body.id;
  const state = req.body.state;

  // insert application into list
  const result = await collections.tutorApplications!.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        state,
      },
    }
  );
  if (!result.matchedCount) {
    throw new HttpError(404, "Not found");
  }

  res.json();
};

export const getTutorApplication = async (req: Request, res: Response) => {
  const { id } = req.query;
  const document = await collections.tutorApplications
    ?.aggregate([
      { $match: { _id: new ObjectId(id as string) } },
      {
        $lookup: {
          from: "tutorProfiles",
          localField: "tutor",
          foreignField: "owner",
          as: "tutorProfile",
        },
      },
      {
        $unwind: {
          path: "$tutorProfile",
        },
      },
    ])
    .next();

  if (!document) {
    throw new HttpError(404, "Not found");
  }
  const object = TutorApplication.assign(document as TutorApplication);

  res.json({ tutorApplication: object });
};

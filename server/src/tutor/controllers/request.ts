import { Request, Response } from "express";

import HttpError from "../../errors/HttpError";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";
import TutorRequest from "../models/TutorRequest";

require("express-async-errors");
export const getTutorRequests = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  // filter
  const filter = {};

  const totalCount = await collections.tutorRequests!.countDocuments(filter);
  const documents = await collections
    .tutorRequests!.aggregate([
      { $match: filter },
      // will probably add lookup stuff here
    ])
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert documents into objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const objects = [];
  for (const doc of documents) {
    const object = TutorRequest.assign(doc as TutorRequest);
    objects.push(object);
  }

  res.json({ tutorRequests: objects, count: totalCount });
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

  const result = await collections.tutorRequests?.insertOne(newObject);

  res.status(201).json(result);
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

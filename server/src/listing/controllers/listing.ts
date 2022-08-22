import { Request, Response } from "express";
import { wrap } from "@mikro-orm/core";
import { v2 as cloudinary } from "cloudinary";

import { DI } from "../../index";
import { Listing } from "../entities";
import HttpError from "../../errors/HttpError";

require("express-async-errors");

export const getListings = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  // process search queries
  const searchQuery: any[] = [];
  // search query filter processing goes here
  let filter = {};
  if (searchQuery.length !== 0) {
    filter = { $and: searchQuery };
  }

  // determine order
  let orderBy: any = { createdAt: "desc" };

  const [listings, count] = await DI.listingRepository.findAndCount(filter, {
    offset: (+page - 1) * +limit,
    limit: +limit,
    orderBy,
    populate: ["owner"],
  });

  // keep only relevant info for tutor
  const listingsResult = listings.map((listing) => ({
    ...wrap(listing).toObject(),
    owner: {
      name: listing.owner.name,
      id: listing.owner.id,
    },
  }));

  res.json({ listings: listingsResult, count });
};

export const getListingDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await DI.listingRepository.findOne(id, ["tutor"]);
  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  // keep only relevant info for tutor
  const listingResult = {
    ...wrap(listing).toObject(),
    owner: { name: listing.owner.name, id: listing.owner.id },
  };

  res.json(listingResult);
};

export const createListing = async (req: Request, res: Response) => {
  // create listing
  const listing = new Listing();
  listing.owner = req.user!;
  wrap(listing).assign(req.body);
  await DI.listingRepository.persistAndFlush(listing);

  res.status(201).json(listing);
};

export const uploadListingImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const listing = await DI.listingRepository.findOne(id);

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  // check that user is owner
  if (listing.owner.id !== req.session.userId) {
    throw new HttpError(403, "Forbidden - User not owner");
  }

  // delete old image and upload new image
  if (req.file) {
    // delete image if exists
    if (listing.image && listing.image.id) {
      // remove existing image
      await cloudinary.uploader.destroy(listing.image.id);
    }

    // upload image
    listing.image = { url: req.file.path, id: req.file.filename };
    await DI.listingRepository.flush();
  }

  res.json(listing);
};

export const replaceListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  const listing = await DI.listingRepository.findOne(id);

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  // check that user is owner
  if (listing.owner.id !== req.session.userId) {
    throw new HttpError(403, "Forbidden - User not owner");
  }

  // update fields
  wrap(listing).assign(req.body);

  // save
  await DI.listingRepository.flush();
  res.json(listing);
};

// export const updateListing = async (req: Request, res: Response) => {};

export const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  const listing = await DI.listingRepository.findOne(id);

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  // check that user is owner
  if (listing.owner.id !== req.session.userId) {
    throw new HttpError(403, "Forbidden - User not owner");
  }

  await DI.listingRepository.removeAndFlush(listing);

  res.json(listing);
};

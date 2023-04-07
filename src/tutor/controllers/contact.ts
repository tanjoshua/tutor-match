import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import HttpError from "../../errors/HttpError";
import { collections } from "../../services/database.service";
import { sendEmail } from "../../services/email.service";
import { generateContactRequestEmail } from "../../utils/emailFactory";
import TutorProfile from "../models/TutorProfile";

require("express-async-errors");
export const contactTutorFromBrowse = async (req: Request, res: Response) => {
  const { profileId, name, email, phoneNumber, message } = req.body;

  const profileDocument = await collections.tutorProfiles
    ?.aggregate([
      { $match: { _id: new ObjectId(profileId) } },
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
  const tutorAccountEmail = profile.ownerDetails.email;

  // log information?
  collections.contactLogs?.insertOne({
    tutorProfile: profileId,
    name,
    email,
    phoneNumber,
    message,
  });

  sendEmail(
    generateContactRequestEmail({
      recipientEmail: tutorAccountEmail,
      tutorName: profile.ownerDetails.name,
      clientName: name,
      clientEmail: email,
      clientPhoneNumber: phoneNumber,
      message,
    })
  );
  res.json({});
};

export const contactTutorFromRequest = async (_req: Request, res: Response) => {
  res.json({});
};

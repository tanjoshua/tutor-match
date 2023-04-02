// External Dependencies
import * as mongoDB from "mongodb";
import { ObjectId } from "mongodb";
import { PasswordReset } from "../base/models/PasswordReset";
import User from "../base/models/User";
import Invoice from "../invoicing/models/Invoice";
import TutorProfile from "../tutor/models/TutorProfile";
import TutorApplication from "../tutor/models/TutorApplication";
import TutorRequest from "../tutor/models/TutorRequest";
import { DB_CONN_STRING, DB_NAME } from "../utils/config";
import EmailVerification from "../base/models/EmailVerification";

// Global Variables
export const collections: {
  invoices?: mongoDB.Collection<Invoice>;
  users?: mongoDB.Collection<User>;
  emailVerifications?: mongoDB.Collection<EmailVerification>;
  passwordReset?: mongoDB.Collection<PasswordReset>;
  // tutors
  tutorProfiles?: mongoDB.Collection<TutorProfile>;
  tutorRequests?: mongoDB.Collection<TutorRequest>;
  tutorApplications?: mongoDB.Collection<TutorApplication>;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING!);

  await client.connect();

  const db: mongoDB.Db = client.db(DB_NAME);

  collections.invoices = db.collection<Invoice>("invoices");
  collections.users = db.collection<User>("user");
  collections.emailVerifications =
    db.collection<EmailVerification>("emailVerifications");
  collections.passwordReset = db.collection<PasswordReset>("passwordReset");

  // tutors
  collections.tutorProfiles = db.collection<TutorProfile>("tutorProfiles");
  collections.tutorRequests = db.collection<TutorRequest>("tutorRequests");
  collections.tutorApplications = db.collection<TutorApplication>("tutorApps");

  console.log(`Successfully connected to database: ${db.databaseName}.`);

  // create indexes - these functions are idempotent

  // USER indexes
  collections.users.createIndex({ email: 1 });

  // profiles indexes
  collections.tutorProfiles.createIndex({ owner: 1 });
  collections.tutorProfiles.createIndex({
    isPublic: 1,
    allSubjects: 1,
    type: 1,
    gender: 1,
  });
  collections.tutorProfiles.createIndex({
    isPublic: 1,
    levels: 1,
    type: 1,
    gender: 1,
  });
  // TODO: test and add more if necessary

  // request index
  // TODO: compound filter?
  collections.tutorRequests.createIndex({ clientAccessToken: 1 });
  collections.tutorRequests.createIndex({
    region: 1,
    levelCategory: 1,
    subject: 1,
    "pricing.rate": 1,
  });

  // tutor app index
  collections.tutorApplications.createIndex({ tutor: 1 });
  collections.tutorApplications.createIndex({ tutor: 1, tutorRequest: 1 });
  collections.tutorApplications.createIndex({ tutorRequest: 1, state: 1 });
}

export function dateToObjectId(date: Date) {
  const timestamp = date.getTime();
  /* Create an ObjectId with that timestamp */
  var constructedObjectId = ObjectId.createFromTime(timestamp / 1000);
  return constructedObjectId;
}

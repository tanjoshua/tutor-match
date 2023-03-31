// External Dependencies
import * as mongoDB from "mongodb";
import { ObjectId } from "mongodb";
import { PasswordReset } from "../base/models/PasswordReset";
import User from "../base/models/User";
import Invoice from "../invoicing/models/Invoice";
import TutorProfile from "../tutor/models/Profile";
import TutorApplication from "../tutor/models/TutorApplication";
import TutorRequest from "../tutor/models/TutorRequest";
import { DB_CONN_STRING, DB_NAME } from "../utils/config";

// Global Variables
export const collections: {
  invoices?: mongoDB.Collection<Invoice>;
  users?: mongoDB.Collection<User>;
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
  collections.passwordReset = db.collection<PasswordReset>("passwordReset");

  // tutors
  collections.tutorProfiles = db.collection<TutorProfile>("tutorProfiles");
  collections.tutorRequests = db.collection<TutorRequest>("tutorRequests");
  collections.tutorApplications = db.collection<TutorApplication>("tutorApps");

  console.log(`Successfully connected to database: ${db.databaseName}.`);
}

export function dateToObjectId(date: Date) {
  const timestamp = date.getTime();
  /* Create an ObjectId with that timestamp */
  var constructedObjectId = ObjectId.createFromTime(timestamp / 1000);
  return constructedObjectId;
}

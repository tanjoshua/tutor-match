// External Dependencies
import * as mongoDB from "mongodb";
import { PasswordReset } from "../base/models/PasswordReset";
import User from "../base/models/User";
import Invoice from "../invoicing/models/Invoice";
import TutorProfile from "../tutor/models/Profile";
import TutorRequest from "../tutor/models/TutorRequest";
import { DB_CONN_STRING } from "../utils/config";

// Global Variables
export const collections: {
  invoices?: mongoDB.Collection<Invoice>;
  users?: mongoDB.Collection<User>;
  passwordReset?: mongoDB.Collection<PasswordReset>;
  // tutors
  tutorProfiles?: mongoDB.Collection<TutorProfile>;
  tutorRequests?: mongoDB.Collection<TutorRequest>;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING!);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  collections.invoices = db.collection<Invoice>("invoices");
  collections.users = db.collection<User>("user");
  collections.passwordReset = db.collection<PasswordReset>("password-reset");

  // tutors
  collections.tutorProfiles = db.collection<TutorProfile>("tutor-profiles");
  collections.tutorRequests = db.collection<TutorRequest>("tutor-requests");

  console.log(`Successfully connected to database: ${db.databaseName}.`);
}

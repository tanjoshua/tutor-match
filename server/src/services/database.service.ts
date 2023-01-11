// External Dependencies
import * as mongoDB from "mongodb";
import Invoice from "../invoicing/models/Invoice";
import { DB_CONN_STRING } from "../utils/config";

// Global Variables
export const collections: { invoices?: mongoDB.Collection<Invoice> } = {};

// Initialize Connection
export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING!);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  collections.invoices = db.collection<Invoice>("invoices");

  console.log(`Successfully connected to database: ${db.databaseName}.`);
}

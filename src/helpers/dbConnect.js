// db/dbConnect.js
/* import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config/config.js";

const uri = `mongodb+srv://${config.dbUser}:${config.dbPass}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;

// Create the client instance ONCE
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// This will store the DB instance after connection
export let db;

export const dbConnect = async () => {
  try {
    await client.connect();
    db = client.db("courseMaster"); // <-- Assign DB here
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}; */

// db/dbConnect.js
import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config/config.js";

const uri = `mongodb+srv://${config.dbUser}:${config.dbPass}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;

let client;
let db;

export const dbConnect = async () => {
  try {
    // Reuse existing client in serverless environments
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await client.connect();
      db = client.db("courseMaster");
      console.log("✅ MongoDB connected successfully");
    }

    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
};

export const getDb = () => db;


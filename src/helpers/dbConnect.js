// db/dbConnect.js 
 import { MongoClient, ServerApiVersion } from "mongodb";
  import config from "../config/config.js";
  const uri = `mongodb+srv://${config.dbUser}:${config.dbPass}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority`;
  
  // Create the client instance ONCE 
  export const client = new MongoClient(uri, { 
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, }, 
  });
// This will store the DB instance after connection 
 export let db; 
 export const dbConnect = async () => { 
  try { await client.connect(); 
  db = client.db("courseMaster"); 
  // <-- Assign DB here 
  console.log("✅ MongoDB connected successfully"); } 
  catch (err) { 
  console.error("❌ MongoDB connection failed:", err); 
  throw err; } };

/* import { MongoClient } from "mongodb";
import config from "../config/config.js";

let client;
let db;

export const dbConnect = async () => {
  try {
    if (db) {
      console.log("🟢 DB already initialized");
      return db;
    }

    if (!client) {
      client = new MongoClient(
        `mongodb+srv://${config.dbUser}:${config.dbPass}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority`
      );
    }

    console.log("🟡 Connecting to MongoDB...");
    await client.connect();

    db = client.db("courseMaster");
    console.log("🟢 DB Connected:", Boolean(db));

    return db;
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw error;
  }
};

export const getDb = () => {
  console.log("🔍 Getting DB… Current:", db);
  if (!db) throw new Error("❌ DB not initialized. Call dbConnect() first!");
  return db;
}; */


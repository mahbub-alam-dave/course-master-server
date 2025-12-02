import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config/config.js";

const uri = `mongodb+srv://${config.dbUser}:${config.dbPass}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = async () => {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err; // important for server start
  }
};

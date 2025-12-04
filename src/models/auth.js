/* import { client } from "../helpers/dbConnect.js";

export const UserCollection = () =>
  client.db("courseMaster").collection("users"); */

// models/user.model.js
import { getDb } from "../helpers/dbConnect.js";

export const UserCollection = () => {
  const db = getDb();
  return db.collection("users");
};
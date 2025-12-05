

/* import { getDb } from "../helpers/dbConnect.js";

export const courseCollection = () => {
  const db = getDb();
  return db.collection("courses");
}; */

import { client } from "../helpers/dbConnect.js";

export const courseCollection = () =>
  client.db("courseMaster").collection("courses");
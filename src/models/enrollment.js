
/* import { getDb } from "../helpers/dbConnect.js";

export const enrollmentCollection = () => {
  const db = getDb();
  return db.collection("enrollmentStatistics");
}; */


import { client } from "../helpers/dbConnect.js";

export const enrollmentCollection = () =>
  client.db("courseMaster").collection("enrollmentStatistics");
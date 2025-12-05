
/* import { getDb } from "../helpers/dbConnect.js";

export const paymentsCollection = () => {
  const db = getDb();
  return db.collection("payments");
}; */


import { client } from "../helpers/dbConnect.js";

export const paymentsCollection = () =>
  client.db("courseMaster").collection("payments");
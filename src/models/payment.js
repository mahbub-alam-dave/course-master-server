
import { getDb } from "../helpers/dbConnect.js";

export const paymentCollection = () => {
  const db = getDb();
  return db.collection("payments");
};
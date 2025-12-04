
import { getDb } from "../helpers/dbConnect.js";

export const enrollCollection = () => {
  const db = getDb();
  return db.collection("enrollmentStatistics");
};
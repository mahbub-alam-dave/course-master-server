import { client } from "../../helpers/dbConnect.js";

export const enrollmentCollection = () =>
  client.db("courseMaster").collection("enrollmentStatistics");
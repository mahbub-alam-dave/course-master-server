import { client } from "../helpers/dbConnect.js";

export const instructorApplicationCollection = () =>
  client.db("courseMaster").collection("instructorApplication");
import { client } from "../helpers/dbConnect.js";

export const CourseCollection = () =>
  client.db("courseMaster").collection("courses");
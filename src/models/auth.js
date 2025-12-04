import { client } from "../helpers/dbConnect.js";

export const UserCollection = () =>
  client.db("courseMaster").collection("users");
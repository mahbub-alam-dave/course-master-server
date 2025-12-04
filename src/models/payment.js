import { client } from "../helpers/dbConnect.js";

export const paymentsCollection = () =>
  client.db("courseMaster").collection("payments");
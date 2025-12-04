import bcrypt from "bcrypt";
import { UserCollection } from "../../models/auth.js";

export const authService = {
  async registerOrLoginSocial({ name, email, provider }) {
    const users = UserCollection();

    let user = await users.findOne({ email });

    if (user) {
      // Add provider if not exists
      if (!user.providers.includes(provider)) {
        await users.updateOne({ email }, { $push: { providers: provider } });
      }
      return user;
    }

    // create new social user
    const newUser = {
      name,
      email,
      providers: [provider],
      password: "",
      role: "user",
      createdAt: new Date(),
    };

    await users.insertOne(newUser);
    return newUser;
  },

  async registerCredentials({ name, email, password }) {
    const users = UserCollection();

    const existing = await users.findOne({ email });
    if (existing) return null;

    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hash,
      providers: ["credentials"],
      role: "user",
      createdAt: new Date(),
    };

    await users.insertOne(newUser);
    return newUser;
  },

  async loginCredentials({ email, password }) {
    const users = UserCollection();
    const user = await users.findOne({ email });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : false;
  },
};

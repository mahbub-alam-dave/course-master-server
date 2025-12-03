import axios from "axios";
import config from "../../config/config.js";
import { authService } from "./auth.service.js";
import { generateToken } from "../../helpers/token.js";


const CLIENT_URL = config.clientUrl; // your frontend URL

export const authController = {
  // ----- CREDENTIALS -----
  register: async (req, res) => {
    const user = await authService.registerCredentials(req.body);
    if (!user)
      return res.status(400).json({ message: "User already exists" });

    const token = generateToken(user);
    res.json({ user, token });
  },

  login: async (req, res) => {
    const user = await authService.loginCredentials(req.body);

    if (user === null)
      return res.status(404).json({ message: "User not found" });

    if (user === false)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.json({ user, token });
  },

  // ----- GOOGLE LOGIN -----
  googleAuth: (req, res) => {
    const redirect =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleClient}` +
      `&redirect_uri=http://localhost:5000/api/auth/google/callback` +
      `&response_type=code&scope=openid email profile`;

    res.redirect(redirect);
  },

  googleCallback: async (req, res) => {
    const { code } = req.query;

    const tokenRes = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        code,
        client_id: config.googleClient,
        client_secret: config.googleSecret,
        redirect_uri: "http://localhost:5000/api/auth/google/callback",
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenRes.data;

    const profile = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const user = await authService.registerOrLoginSocial({
      name: profile.data.name,
      email: profile.data.email,
      provider: "google",
    });

    const token = generateToken(user);

    // redirect back to frontend with token
    res.redirect(`${CLIENT_URL}/social-login-success?token=${token}`);
  },

  // ----- GITHUB LOGIN -----
  githubAuth: (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${config.githubClient}&scope=user:email`
    );
  },

  githubCallback: async (req, res) => {
    const { code } = req.query;

    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: config.githubClient,
        client_secret: config.githubSecret,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const access_token = tokenRes.data.access_token;

    const profile = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const email = emailRes.data.find((x) => x.primary).email;

    const user = await authService.registerOrLoginSocial({
      name: profile.data.name || "GitHub User",
      email,
      provider: "github",
    });

    const token = generateToken(user);
    res.redirect(`${CLIENT_URL}/social-login-success?token=${token}`);
  },
};

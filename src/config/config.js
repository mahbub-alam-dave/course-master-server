import dotenv from "dotenv"
dotenv.config()
const config = {
    port: process.env.PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    googleClient: process.env.GOOGLE_CLIENT_ID,
    googleSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClient: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET,
    clientUrl: process.env.CLIENT_URL,
    jwtSecret: process.env.JWT_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
}

export default config;
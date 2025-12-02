import dotenv from "dotenv"
dotenv.config()
const config = {
    port: process.env.PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
}

export default config;
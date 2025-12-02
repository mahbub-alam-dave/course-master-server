import dotenv from "dotenv"
dotenv.config()
const config = {
    mongoUri: "",
    port: process.env.PORT
}

export default config;
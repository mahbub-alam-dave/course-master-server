import express from "express"
import config from "./config/config.js";
import { dbConnect } from "./helpers/dbConnect.js";

const app = express();
const port = config.port || 3000

app.use(express.json());
// app.use(express.urlencoded());

// app.use("/auth", )

app.get("/", (req, res) => {
  res.send("🎓 Courser Master API is running...");
});

// Start server only after DB connects
const startServer = async () => {
  try {
    await dbConnect();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // Stop the app
  }
};

startServer();
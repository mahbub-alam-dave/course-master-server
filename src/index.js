import express from "express"
import cors from "cors";
import config from "./config/config.js";
import { dbConnect } from "./helpers/dbConnect.js";
import { authRoutes } from "./modules/authentication/auth.routes.js";
import {coursesRoutes} from "./modules/courses/courses.routes.js"
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js"

const app = express();
const port = config.port || 5000

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));


app.use("/api/auth", authRoutes)
app.use('/api/courses', coursesRoutes);
app.use("/api/enrollments", enrollmentRoutes)

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
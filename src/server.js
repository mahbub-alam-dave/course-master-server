import express from "express"
import cors from "cors";
import config from "./config/config.js";
import { dbConnect } from "./helpers/dbConnect.js";
import { authRoutes } from "./modules/authentication/auth.routes.js";
import {coursesRoutes} from "./modules/courses/courses.routes.js"
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js"
import paymentRoutes from "./modules/payment/payment.routes.js"

const app = express();
const port = config.port || 5000

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://course-master-client-m2ka.vercel.app"],
  credentials: true
}));


app.use("/api/auth", authRoutes)
app.use('/api/courses', coursesRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use('/api/payment', paymentRoutes);

app.get("/", (req, res) => {
  res.send("🎓 Courser Master API is running...");
});



// await dbConnect();

export default app;
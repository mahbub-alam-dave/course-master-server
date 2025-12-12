import express from "express"
import cors from "cors";
import config from "./config/config.js";
import { dbConnect } from "./helpers/dbConnect.js";
import { authRoutes } from "./modules/authentication/auth.routes.js";
import {coursesRoutes} from "./modules/courses/courses.routes.js"
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js"
import paymentRoutes from "./modules/payment/payment.routes.js"
import { adminRoutes } from "./modules/admin/admin.routes.js";

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
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("🎓 Courser Master API is running...");
});



// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Courser Master Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



await dbConnect();

export default app;
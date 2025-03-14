import express from 'express';
import cors from "cors";
import "dotenv/config.js";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import projectRouter from './routes/projectRoute.js';
import contratorRouter from './routes/contractorRoute.js';
import testimonialRouter from './routes/testimonialRoute.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // specify your client URL
  credentials: true
}));

// Add file upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './temp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.get("/", (req, res) => res.send("API Working Perfectly"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/contractor", contratorRouter);
app.use("/api/testimonials", testimonialRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
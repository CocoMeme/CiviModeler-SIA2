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

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // specify your client URL
  credentials: true
}));

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
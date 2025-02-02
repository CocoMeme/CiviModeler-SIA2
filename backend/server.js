import express from 'express';
import cors from "cors";
import "dotenv/config.js";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
//   origin: ["http://localhost:3000"],
  credentials: true
}));

// API Endpoints
app.get("/", (req, res) => res.send("API Working Perfectly"));
app.use("/api/auth", authRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
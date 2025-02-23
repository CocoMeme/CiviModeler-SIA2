import express from "express";
import {getAllTestimonials, createTestimonial} from "../controllers/testimonialController.js";
import userAuth from "../middleware/userAuth.js";

const testimonialRouter = express.Router();

testimonialRouter.get("/all", userAuth, getAllTestimonials);
testimonialRouter.post("/create", createTestimonial);

export default testimonialRouter;
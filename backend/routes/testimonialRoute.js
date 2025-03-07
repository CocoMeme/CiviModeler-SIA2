import express from "express";
import {getAllTestimonials, createTestimonial, getRatingsData} from "../controllers/testimonialController.js";
import userAuth from "../middleware/userAuth.js";

const testimonialRouter = express.Router();

testimonialRouter.get("/all", getAllTestimonials);
testimonialRouter.post("/create", userAuth,createTestimonial);
testimonialRouter.get("/ratings", getRatingsData);

export default testimonialRouter;
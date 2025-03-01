import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const testimonialModel = mongoose.models.testimonial || mongoose.model("testimonial", TestimonialSchema);
export default testimonialModel;
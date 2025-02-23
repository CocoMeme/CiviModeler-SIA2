import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
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

const testimonialModel = mongoose.models.testimonial || mongoose.model("Testimonial", TestimonialSchema);
export default testimonialModel;
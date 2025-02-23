import Testimonial from '../models/testimonialModel.js';

// const convertRatingToStars = (rating) => {
//     return '★'.repeat(rating) + '☆'.repeat(5 - rating);
//   };

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createTestimonial = async (req, res) => {
  const testimonial = new Testimonial({
    name: req.body.name,
    position: req.body.position,
    quote: req.body.quote,
    rating: req.body.rating,
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
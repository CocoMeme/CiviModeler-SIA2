import testimonialModel from '../models/testimonialModel.js';

// const convertRatingToStars = (rating) => {
//     return '★'.repeat(rating) + '☆'.repeat(5 - rating);
//   };

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createTestimonial = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const testimonial = new testimonialModel({
    name: req.user.name, 
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

export const getRatingsData = async (req, res) => {
  try {
    const ratings = await testimonialModel.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
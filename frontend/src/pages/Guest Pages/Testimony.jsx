import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Filter } from "bad-words";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Star rating component
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`text-2xl cursor-pointer ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => setRating && setRating(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Custom arrow components
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "purple" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "purple" }}
      onClick={onClick}
    />
  );
};

const Testimony = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log("Fetching testimonials...");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/all`, 
          { withCredentials: true }
        );
        
        console.log("API Response:", response.data);
  
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setTestimonials(response.data); // Set testimonials directly
        } else {
          console.error("API Error: Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error.message, error.response?.data);
      }
    };
  
    fetchTestimonials();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filter = new Filter();
    const filteredName = filter.clean(name);
    const filteredPosition = filter.clean(position);
    const filteredQuote = filter.clean(quote);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/create`,
        { name: filteredName, position: filteredPosition, quote: filteredQuote, rating },
        { withCredentials: true }
      );
      console.log("Testimonial submitted:", response.data);
      setTestimonials([...testimonials, response.data]); // Add the new testimonial to the list
      setName("");
      setPosition("");
      setQuote("");
      setRating(0);
      setError(null);
    } catch (error) {
      console.error("Error submitting testimonial:", error.message, error.response?.data);
      setError(error.response?.data?.message || "An error occurred while submitting the testimonial.");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-8 pt-24 pb-16 min-h-screen">
      {/* Header */}
      <h3 className="text-center text-gray-500 uppercase tracking-widest text-lg">
        Testimonials
      </h3>
      <h1 className="text-5xl font-extrabold text-center text-purple-700 my-4">
        What Clients Say
      </h1>
      <p className="text-center text-gray-700 text-xl mb-12 max-w-3xl mx-auto">
        We place huge value on strong relationships and have seen the benefit
        they bring to our business. Customer feedback is vital in helping us to
        get it right.
      </p>

      {/* Testimonial Carousel */}
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-4">
            <div
              className="bg-white p-8 shadow-2xl rounded-2xl text-center border-t-4 border-purple-500 
                         transition-transform transform hover:scale-105 hover:shadow-3xl hover:border-purple-700"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500 mb-6 transition-transform transform hover:scale-110"
              />
              <p className="text-gray-600 italic text-lg">❝ {testimonial.quote} ❞</p>

              {/* Star Rating */}
              <StarRating rating={testimonial.rating} />

              <h3 className="text-purple-700 font-extrabold text-2xl mt-6">
                {testimonial.name}
              </h3>
              <p className="text-gray-500 text-lg">{testimonial.position}</p>
            </div>
          </div>
        ))}
      </Slider>

      {/* Submit Feedback Form */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Submit Your Feedback
        </h2>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
              Position
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quote">
              Quote
            </label>
            <textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rating
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Testimony;
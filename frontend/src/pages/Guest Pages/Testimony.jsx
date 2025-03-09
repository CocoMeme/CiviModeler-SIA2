import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AppContext } from "../../context/AppContext";

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`text-2xl cursor-pointer ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
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
  const { backendUrl } = useContext(AppContext);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log("Fetching testimonials...");
        const response = await axios.get(
          `${backendUrl}/api/testimonials/all`,
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
  }, [backendUrl]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
              <p className="text-gray-600 italic text-lg">❝ {testimonial.quote} ❞</p>

              {/* Star Rating */}
              <StarRating rating={testimonial.rating} />

              <h3 className="text-purple-700 font-extrabold text-2xl mt-6">
                {testimonial.name}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimony;
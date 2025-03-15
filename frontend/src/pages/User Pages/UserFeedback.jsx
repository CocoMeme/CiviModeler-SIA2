import React, { useState, useContext } from "react";
import axios from "axios";
import { Filter } from "bad-words";
import { AppContext } from "../../context/AppContext";

const StarRating = ({ rating, setRating }) => {
  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="star-rating flex justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-3xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
          onClick={() => handleRating(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const UserFeedback = () => {
  const { backendUrl } = useContext(AppContext);
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filter = new Filter();
    const filteredQuote = filter.clean(quote);

    try {
      const response = await axios.post(
        `${backendUrl}/api/testimonials/create`,
        { quote: filteredQuote, rating },
        { withCredentials: true }
      );
      console.log("Testimonial submitted:", response.data);
      setQuote("");
      setRating(0);
      setError(null);
      setSuccess("Thank you for your feedback.");
    } catch (error) {
      console.error("Error submitting testimonial:", error.message, error.response?.data);
      setError(error.response?.data?.message || "An error occurred while submitting the testimonial.");
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H7.png" alt="CiviModeler H7" />
      <div className="container mx-auto px-8 pt-24 pb-16 min-h-screen">

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Submit Your Feedback
        </h2>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
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

export default UserFeedback;
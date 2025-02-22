import React from "react";

const testimonials = [
  {
    name: "Nat Reynolds",
    position: "Chief Accountant",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote:
      "Vitae suscipit tellus mauris a diam maecenas sed enim ut. Mauris augue neque gravida in fermentum. Praesent semper feugiat nibh sed pulvinar proin.",
    rating: 5,
  },
  {
    name: "Celia Almeda",
    position: "Secretary",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    quote:
      "Pharetra vel turpis nunc eget lorem. Quisque id diam vel quam elementum pulvinar etiam. Urna porttitor rhoncus dolor purus non enim praesent elementum.",
    rating: 4,
  },
  {
    name: "Bob Roberts",
    position: "Sales Manager",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote:
      "Mauris augue neque gravida in fermentum. Praesent semper feugiat nibh sed pulvinar proin. Nibh nisl dictumst vestibulum rhoncus est pellentesque elit.",
    rating: 5,
  },
];

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`text-2xl ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Testimony = () => {
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

      {/* Testimonial Cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
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
        ))}
      </div>
    </div>
  );
};

export default Testimony;

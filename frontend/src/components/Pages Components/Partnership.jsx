import React from "react";

const logos = [
  "/project images/Partnership Logos/Vite.png",
  "/project images/Partnership Logos/Brevo.png",
  "/project images/Partnership Logos/Cloudinary.png",
  "/project images/Partnership Logos/MongoDB.png",
  "/project images/Partnership Logos/Node JS.png",
  "/project images/Partnership Logos/Sloyd.png",
];

const Partnership = () => {
  return (
    <div className="bg-black py-10 overflow-hidden relative">
      <h2 className="text-center text-white text-3xl font-bold mb-6">
        Our Trusted Partners
      </h2>

      {/* Fading effect on both ends */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>

      {/* Scrolling Logos */}
      <div className="relative w-full flex items-center">
        <div className="flex space-x-20 animate-scroll">
          {logos.concat(logos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Partner ${index}`}
              className="h-32 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partnership;

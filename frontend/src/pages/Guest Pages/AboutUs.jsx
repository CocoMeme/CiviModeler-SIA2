import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-black p-16">
      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Logo */}
        <div className="flex-shrink-0 mt-10">
          <img src="/images/CiviAboutus.png" alt="CiviModeler Logo" className="logo-img" />
        </div>

        {/* Right Side - Text Content */}
        <div className="max-w-3xl text-right">
          <h1 className="text-6xl font-bold">We build homes with a personal touch</h1>
          <p className="mt-6 text-xl text-gray-700 leading-relaxed">
            <span className="text-orange-400 font-semibold">
              From dreams to blueprints to reality - CiviModeler can help.
            </span>
            <br /><br />
            Our platform combines cutting-edge technology with expert design insights to ensure your model is both visually stunning and practical. Whether you’re dreaming of a cozy cottage, a sleek modern house, or a spacious family home, CiviModeler empowers you to visualize your ideas and make informed decisions—all within your budget.
          </p>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold">Meet the Team</h2>
        <p className="text-lg text-gray-600 mt-2">
          Our passionate professionals dedicated to your projects.
        </p>

        {/* Team Members Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            { name: "Joey Ann Lavega", role: "Full Stack Developer", img: "/images/team1.jpg" },
            { name: "Andrei Co", role: "Full Stack Developer", img: "/images/team2.jpg" },
            { name: "Josh Ziemenn Tan", role: "Full Stack Developer", img: "/images/team3.jpg" },
            { name: "Fatima Trinidad", role: "Full Stack Developer", img: "/images/pic.jpg" }
          ].map((member, index) => (
            <div key={index} className="bg-gray-200 p-6 rounded-lg shadow-lg text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-40 h-40 mx-auto rounded-full border-4 border-yellow-400 shadow-md"
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

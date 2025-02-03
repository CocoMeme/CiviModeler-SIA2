import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-between bg-gray-900 text-white p-16">
      {/* Left Side - Logo */}
      <div className="flex-shrink-0">
  <img src="/images/CiviAboutus.png" alt="CiviModeler Logo" className="logo-img" />
</div>


      {/* Right Side - Text Content */}
      <div className="max-w-3xl text-right">
        <h1 className="text-6xl font-bold">We build homes with a personal touch</h1>
        <p className="mt-6 text-xl text-gray-300 leading-relaxed">
          <span className="text-orange-400 font-semibold">
            From dreams to blueprints to reality - CiviModeler can help.
          </span>
          <br /><br />
          Our platform combines cutting-edge technology with expert design insights to ensure your model is both visually stunning and practical. Whether you’re dreaming of a cozy cottage, a sleek modern house, or a spacious family home, CiviModeler empowers you to visualize your ideas and make informed decisions—all within your budget.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;

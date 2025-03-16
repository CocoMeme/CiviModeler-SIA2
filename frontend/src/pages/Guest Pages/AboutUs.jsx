import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-black relative overflow-hidden mt-20">
      {/* Background Image with Fade */}
      <div className="absolute top-20 left-48 w-[650px] h-[450px]">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-5">
            <img 
              src="/images/CiviAboutus.png" 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays for fade effects with reduced intensity */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16 relative z-20"
      >
        {/* About Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Content side */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl ml-auto"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-violet-500 bg-clip-text text-transparent">
              We build homes with a personal touch
            </h1>
            <p className="mt-6 text-xl text-gray-700 leading-relaxed">
              <span className="text-2xl font-semibold text-violet-500">
                From dreams to blueprints to reality - CiviModeler can help.
              </span>
              <br /><br />
              <span className="leading-loose">
                Our platform combines cutting-edge technology with expert design insights to ensure your model is both visually stunning and practical. Whether you're dreaming of a cozy cottage, a sleek modern house, or a spacious family home, CiviModeler empowers you to visualize your ideas and make informed decisions—all within your budget.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Meet the Team Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-violet-500 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-600 mt-2 mb-12">
            Our passionate professionals dedicated to your projects.
          </p>

          {/* Professor Card */}
          <div className="mb-16">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 max-w-md mx-auto"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full transform -rotate-6"></div>
                <img
                  src="/images/Madriaga.jpg"
                  alt="Ms. Pops Madriaga"
                  className="relative w-48 h-48 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mt-4 text-gray-900">Pops Madriaga</h3>
              <p className="text-violet-500 font-medium text-lg">Professor</p>
            </motion.div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
            {[
              { name: "Joey Ann Lavega", role: "Full Stack Developer", img: "/images/team1.jpg" },
              { name: "Andrei Co", role: "Full Stack Developer", img: "/images/Andrei Co.jpg" },
              { name: "Josh Ziemenn Tan", role: "Full Stack Developer", img: "/images/josh.jpg" },
              { name: "Fatima Trinidad", role: "Full Stack Developer", img: "/images/pic.jpg" }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full transform -rotate-6"></div>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="relative w-40 h-40 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-900">{member.name}</h3>
                <p className="text-violet-500 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;

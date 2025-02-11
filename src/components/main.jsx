import React from "react";
import { motion } from "framer-motion";

const HourglassMining = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-28 h-40">
        {/* Top Glass */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-300 to-transparent rounded-t-full border-4 border-gray-500"></div>

        {/* Bottom Glass */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-300 to-transparent rounded-b-full border-4 border-gray-500"></div>

        {/* Sand Falling Animation */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-yellow-500 rounded-b-full"
          animate={{
            height: [0, 20, 40, 60], // Growing effect
            opacity: [1, 0.8, 0.6, 0.4], // Fading effect
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>

        {/* Sand Pile at Bottom */}
        <motion.div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-yellow-500 rounded-full"
          animate={{
            scale: [0.5, 1],
            opacity: [0.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>
    </div>
  );
};

export default HourglassMining;

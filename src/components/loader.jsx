import React from "react";

const HourglassLoader = () => {
  return (
    <div className="flex items-center justify-center fixed top-0 left-0 w-full h-screen bg-gray-100">
      <div className="relative flex items-center justify-center">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default HourglassLoader;

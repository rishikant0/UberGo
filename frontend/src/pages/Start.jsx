import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-black grid grid-rows-[1fr_auto]">
      
      {/* Traffic Light Section */}
      <div className="relative w-full overflow-hidden">
        
        {/* Uber Logo */}
        <img
          className="absolute z-10 top-8 left-8 w-20"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />

        {/* Traffic Light Image */}
        <img
          src="https://www.familyhandyman.com/wp-content/uploads/2025/07/What-Does-Each-Traffic-Light-Symbol-Mean_GettyImages-2168516574_FT.jpg"
          alt="Traffic Light"
          className="w-full h-full object-cover scale-100"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Bottom Card */}
      <div className="bg-white rounded-t-3xl px-8 py-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold mb-5 text-black">
          Get Started with Uber
        </h1>

        {/* ✅ Correct Link */}
        <Link
          to="/login"
          className="block text-center w-full bg-black text-white py-3 rounded-xl text-lg font-semibold"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Home;

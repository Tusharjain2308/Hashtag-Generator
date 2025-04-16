import React, { useEffect } from "react";
import { OpeningHero } from "../components/hero_sections/HomePageOpeningHero.jsx";
import HashtagForm from "../components/hero_sections/GenerateHashtagsHero.jsx";
import { NavbarDemo } from "../components/navbar/HeroNavbar.jsx";

const Home = () => {
  // Ensure page scrolls to the top when component mounts or after login
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="relative z-20">
        <NavbarDemo />
      </div>

      {/* Main Hero Section */}
      <div className="h-screen w-auto relative z-10">
        <OpeningHero />
        <HashtagForm />
      </div>
    </div>
  );
};

export default Home;

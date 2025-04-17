import React, { useEffect } from "react";
import { OpeningHero } from "../components/hero_sections/HomePageOpeningHero.jsx";
import HashtagForm from "../components/hero_sections/GenerateHashtagsHero.jsx";
import { NavbarDemo } from "../components/navbar/HeroNavbar.jsx";

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

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

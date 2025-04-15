import React from "react";
import { OpeningHero } from "../components/hero_sections/HomePageOpeningHero.jsx";
import HashtagForm from "../components/hero_sections/GenerateHashtagsHero.jsx";

const Home = () => {
  return (
    <div>
      <div className="h-screen w-auto">
        <OpeningHero />
        <HashtagForm />
      </div>
      
    </div>
  );
};

export default Home;

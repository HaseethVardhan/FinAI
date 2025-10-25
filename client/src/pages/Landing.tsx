import React from "react";
import Navigation from "../landingPageComponents/Navigation";
import Hero from "../landingPageComponents/Hero";
import Features from "../landingPageComponents/Features";
import HowItWorks from "../landingPageComponents/HowItWorks";
import Footer from "../landingPageComponents/Footer";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Landing;

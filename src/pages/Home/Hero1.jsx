import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "/images/banner1.jpg";
import { ArrowRight, PenBox } from "lucide-react";

const Hero1 = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="min-h-screen flex justify-start items-center text-white bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-12">
          <div className="hero-content max-w-3xl">
            <div
              className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full mb-4 text-sm font-medium"
              style={{ "--delay": 1 }}
            >
              Welcome to YOG-GURU
            </div>

            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-light mb-2"
              style={{ "--delay": 2 }}
            >
              We Provide
            </h2>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ "--delay": 3 }}
            >
              Best Yoga Courses
              <br />
              <span className="text-indigo-300">Online</span>
            </h1>

            <div
              className="mb-8 text-lg text-gray-200 max-w-xl"
              style={{ "--delay": 4 }}
            >
              <p>
                Born in Nepal, YOG-GURU is the first platform of its kind to
                offer flexible, personalized yoga experiences—connecting
                learners with certified instructors for transformative sessions.
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-5"
              style={{ "--delay": 5 }}
            >
              <button
                onClick={() => navigate("/classes")}
                className="hero-btn group flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 font-medium transition-all duration-300"
              >
                Join Today
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate("/instructors")}
                className="hero-btn flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white hover:border-indigo-400 font-medium transition-all duration-300"
              >
                <PenBox className="w-4 h-4 ml-1" />
                Book An Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero1;

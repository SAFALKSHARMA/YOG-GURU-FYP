import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "/images/banner3.jpg";
import { ArrowRight, NewspaperIcon } from "lucide-react";

const Hero3 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="min-h-screen flex justify-start items-center text-white bg-gradient-to-tr from-black/80 via-black/50 to-black/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="hero-content max-w-3xl">
            <div
              className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full mb-4 text-sm font-medium"
              style={{ "--delay": 1 }}
            >
              Community & Connection
            </div>

            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-light mb-2"
              style={{ "--delay": 2 }}
            >
              Join Our Community
            </h2>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ "--delay": 3 }}
            >
              Traditional Yoga
              <br />
              <span className="text-teal-300">Modern Approach</span>
            </h1>

            <div
              className="mb-8 text-lg text-gray-200 max-w-xl"
              style={{ "--delay": 4 }}
            >
              <p>
                YOG-GURU honors the ancient traditions of yoga while making
                practice accessible for modern lifestyles. Connect with a
                community of like-minded practitioners and expert instructors.
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-5"
              style={{ "--delay": 5 }}
            >
              <button
                onClick={() => navigate("/instructors")}
                className="hero-btn group flex items-center gap-2 px-8 py-4 rounded-full bg-teal-600 hover:bg-teal-700 font-medium transition-all duration-300"
              >
                Join Today
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate("/blog")}
                className="hero-btn flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white hover:border-teal-400 font-medium transition-all duration-300"
              >
                <NewspaperIcon className="w-4 h-4 ml-1" />
                View Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3;

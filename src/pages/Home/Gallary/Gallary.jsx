import React from "react";
import bgImg1 from "/images/banner1.jpg";
import bgImg2 from "/images/banner2.jpg";
import bgImg3 from "/images/banner3.jpg";
import bgImg4 from "/images/banner1.jpg";
import bgImg5 from "/images/banner2.jpg";
import bgImg6 from "/images/banner3.jpg";

const images = [bgImg1, bgImg2, bgImg3, bgImg4, bgImg5, bgImg6];

const Gallery = () => {
  return (
    <div className="md:w-[100%] mx-auto my-28">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold">Our Gallery</h1>
        <p className="text-gray-600 mt-2">
          A glimpse into our yoga and wellness journey.
        </p>
      </div>
      <div className="flex justify-center items-center gap-4 overflow-hidden group">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative w-[40%] h-[525px] cursor-pointer transition-all duration-300 ease-in-out group-hover:w-[30%] hover:!w-[250%]"
          >
            <div
              className="w-full h-full bg-cover bg-center shadow-lg transition-all duration-300 group-hover:opacity-100 hover:opacity-100"
              style={{ backgroundImage: `url(${src})`, borderRadius: "10px" }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

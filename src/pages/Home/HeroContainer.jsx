import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { EffectCreative, Autoplay, Pagination } from "swiper";
import Hero2 from "./Hero2";
import Hero from "./Hero";
import Hero3 from "./Hero3";

const HeroContainer = () => {
  return (
    <section className="relative">
      <Swiper
        grabCursor={true}
        effect={"creative"} // Enables smooth creative transitions
        creativeEffect={{
          prev: { opacity: 0, translate: ["-100%", 0, -500] },
          next: { opacity: 1, translate: ["100%", 0, -500] },
        }}
        speed={1200} // Smooth transition duration
        modules={[EffectCreative, Autoplay, Pagination]}
        className="hero-swiper"
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <Hero />
        </SwiperSlide>
        <SwiperSlide>
          <Hero2 />
        </SwiperSlide>
        <SwiperSlide>
          <Hero3 />
        </SwiperSlide>
      </Swiper>

      {/* Custom Pagination Styling */}
      <style>{`
        .swiper-pagination {
          display: flex !important;
          justify-content: center !important;
          position: absolute !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 10 !important;
          gap: 10px !important;
        }

        .swiper-pagination-bullet {
          width: 50px !important;
          height: 12px !important;
          border-radius: 20px !important;
          transition: all 0.3s ease !important;
          background: rgba(255, 255, 255, 0.4) !important;
        }

        .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 1) !important;
          width: 60px !important;
        }
      `}</style>
    </section>
  );
};

export default HeroContainer;

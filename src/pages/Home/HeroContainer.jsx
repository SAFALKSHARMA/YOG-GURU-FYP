import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { EffectCoverflow, Autoplay, Pagination } from "swiper";
import { ArrowRight } from "lucide-react";
import Hero1 from "./Hero1";
import Hero2 from "./Hero2";
import Hero3 from "./Hero3";

const HeroContainer = () => {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        grabCursor={true}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        speed={1000}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className="hero-swiper"
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
      >
        <SwiperSlide>
          <Hero1 />
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
          bottom: 40px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 10 !important;
          gap: 12px !important;
        }

        .swiper-pagination-bullet {
          width: 30px !important;
          height: 4px !important;
          border-radius: 2px !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
        }

        .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 1) !important;
          width: 50px !important;
          height: 4px !important;
        }

        .hero-content {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .swiper-slide-active .hero-content {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content > * {
          transition: all 0.8s ease-out;
          transition-delay: calc(var(--delay) * 100ms);
        }

        .hero-btn {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: all 0.4s ease;
        }

        .hero-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0%;
          height: 100%;
          background-color: white;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          z-index: -1;
        }

        .hero-btn:hover:before {
          width: 100%;
        }

        .hero-btn:hover {
          color: #111;
        }
      `}</style>
    </section>
  );
};

export default HeroContainer;

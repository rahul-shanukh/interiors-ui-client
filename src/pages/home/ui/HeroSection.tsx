// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Button } from "../../../shared/ui/Button";
import { useQueryClient } from "@tanstack/react-query";

// Swiper CSS (Your global.d.ts makes this work!)
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
    title: "Designing Spaces That Tell Your Story",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000",
    title: "Modern Elegance For Your Home",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000",
    title: "Premium Commercial Interiors",
  },
];

export const HeroSection = () => {
  const queryClient = useQueryClient();

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full bg-gray-900">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false, // Keeps autoplaying even after user swipes
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet bg-white opacity-50 w-3 h-3 mx-1 inline-block rounded-full transition-all cursor-pointer hover:opacity-100",
          bulletActiveClass: "!opacity-100 !scale-125",
        }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Content (Unique per slide) */}
            <div className="absolute inset-0 grid grid-rows-[55%_45%] md:grid-rows-[60%_40%] z-20 text-center px-4 max-w-4xl mx-auto">
              <div className="flex flex-col justify-end items-center pb-3 md:pb-4">
                <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight drop-shadow-lg w-full">
                  {slide.title}
                </h1>
              </div>
              
              <div className="flex flex-col justify-start items-center pt-3 md:pt-4 w-full">
                <p className="text-base md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                  From modern residential setups to ground-floor commercial spaces
                  in Warangal. Expertly crafted, on-time delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg"
                    onClick={() => queryClient.setQueryData(["consultModalOpen"], true)}
                  >
                    Get a Free Quote
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg bg-black/20 backdrop-blur-sm"
                  >
                    View Projects
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Add some custom CSS to target Swiper's pagination wrapper to push it up slightly */}
      <style>{`
        .swiper-pagination {
          bottom: 2rem !important;
          z-index: 30;
        }
      `}</style>
    </section>
  );
};

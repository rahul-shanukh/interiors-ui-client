// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Button } from "../../../shared/ui/Button";
import { useQueryClient } from "@tanstack/react-query";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// 1. Import AVIF and WebP formats for your LCP hero images
import heroImg1Avif from "../../../assets/hero/hero.image.avif";
import heroImg1Webp from "../../../assets/hero/hero.image.webp";

import heroImg2Avif from "../../../assets/hero/hero.image.avif";
import heroImg2Webp from "../../../assets/hero/hero.image.webp";

import heroImg3Avif from "../../../assets/hero/hero.image.lvgs.avif";
import heroImg3Webp from "../../../assets/hero/hero.image.lvgs.webp";

const slides = [
  {
    id: 1,
    images: {
      avif: heroImg1Avif,
      fallback: heroImg1Webp, // WebP serves as the ultimate fallback here
    },
    title: "Designing Spaces That Tell Your Story",
  },
  {
    id: 2,
    images: {
      avif: heroImg2Avif,
      fallback: heroImg2Webp,
    },
    title: "Modern Elegance For Your Home",
  },
  {
    id: 3,
    images: {
      avif: heroImg3Avif,
      fallback: heroImg3Webp,
    },
    title: "Premium Commercial Interiors",
  },
];

export const HeroSection = () => {
  const queryClient = useQueryClient();

  return (
    // aria-label helps screen readers understand this is a slider section
    <section
      aria-label="Hero Gallery"
      className="relative h-[80vh] md:h-[90vh] w-full bg-gray-900"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet bg-white opacity-50 w-3 h-3 mx-1 inline-block rounded-full transition-all cursor-pointer hover:opacity-100",
          bulletActiveClass: "!opacity-100 !scale-125",
        }}
        className="h-full w-full [&>.swiper-pagination]:bottom-8 [&>.swiper-pagination]:z-30"
      >
        {slides.map((slide, index) => {
          const isFirstSlide = index === 0;

          return (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              {/* 1. SEO OPTIMIZED PICTURE TAG */}
              <picture>
                {/* Try to load AVIF first */}
                <source srcSet={slide.images.avif} type="image/avif" />

                {/* If AVIF is unsupported, it falls back to this <img> tag which loads the WebP */}
                <img
                  src={slide.images.fallback}
                  alt={slide.title} // Crucial for image SEO
                  decoding="async"
                  loading={isFirstSlide ? "eager" : "lazy"}
                  // @ts-expect-compliance
                  fetchPriority={isFirstSlide ? "high" : "low"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </picture>

              <div className="absolute inset-0 bg-black/50 z-10" />

              <div className="absolute inset-0 grid grid-rows-[55%_45%] md:grid-rows-[60%_40%] z-20 text-center px-4 max-w-4xl mx-auto">
                <div className="flex flex-col justify-end items-center pb-3 md:pb-4">
                  {/* 2. SEO OPTIMIZED HEADING STRUCTURE */}
                  {isFirstSlide ? (
                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight drop-shadow-lg w-full">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight drop-shadow-lg w-full">
                      {slide.title}
                    </h2>
                  )}
                </div>

                <div className="flex flex-col justify-start items-center pt-3 md:pt-4 w-full">
                  <p className="text-base md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                    From modern residential setups to ground-floor commercial
                    spaces in Warangal. Expertly crafted, on-time delivery.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto shadow-lg"
                      onClick={() =>
                        queryClient.setQueryData(["consultModalOpen"] , true)
                      }
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
          );
        })}
      </Swiper>
    </section>
  );
};

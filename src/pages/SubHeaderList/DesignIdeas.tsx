import { useNavigate } from "react-router-dom";
import { FaqSection } from "../home/ui/FaqSection";
import { HomeFooter } from "../home/ui/HomeFooter";

import logo from "../../assets/logo/logo.jpeg";
import BannerImage from "../../assets/Design/BannerImage.avif";
import righesideimage from "../../assets/Design/righesideimage.avif";
import category1 from "../../assets/Design/kitchen.avif";
import category2 from "../../assets/Design/bedroom.avif";
import category3 from "../../assets/Design/wardrobe.avif";
import category4 from "../../assets/Design/bathroom.avif";
import category5 from "../../assets/Design/kids.avif";
import category6 from "../../assets/Design/rug.webp";
import card1 from "../../assets/Design/card1.avif";
import card2 from "../../assets/Design/card2.avif";
import card3 from "../../assets/Design/card3.avif";
import { useEffect, useState } from "react";

const ThemeHeader = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 800);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const primaryLinks = ["Design Ideas", "Projects", "Store Locator", "More"];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-[background-color,box-shadow,padding] duration-1000 ease-in-out ${
        isScrolled ? "bg-[#fdfbf7] shadow-sm py-4" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-480 mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className={`cursor-pointer flex items-center gap-4 transition-colors duration-500 ${isScrolled ? "text-[#4a3f35]" : "text-white"}`}
        >
          <img
            src={logo}
            alt="JC Interiors"
            className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
          />
          <div
            className={`flex flex-col border-l pl-4 transition-colors duration-500 ${isScrolled ? "border-[#4a3f35]/30" : "border-white/30"}`}
          >
            <span
              className="text-2xl font-bold tracking-[0.15em] font-serif leading-none transition-colors duration-700 ease-in-out"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              JC
            </span>
            <span
              className="text-[0.65rem] font-semibold tracking-[0.4em] mt-1.5 transition-colors duration-700 ease-in-out"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              INTERIORS
            </span>
          </div>
        </div>

        <nav
          className={`hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-500 ${isScrolled ? "text-[#4a3f35]" : "text-white/90"}`}
        >
          {primaryLinks
            .filter((link) => link !== "Design Ideas")
            .map((link) => {
              const isStoreLocator = link === "Store Locator";
              const targetUrl = isStoreLocator
                ? "/store-locator"
                : `/#${link.toLowerCase().replace(" ", "-")}`;
              return (
                <a
                  key={link}
                  href={targetUrl}
                  onClick={(e) => {
                    if (isStoreLocator) {
                      e.preventDefault();
                      navigate(targetUrl);
                    }
                  }}
                  className="hover:opacity-60 transition-opacity"
                >
                  {link}
                </a>
              );
            })}
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className={`md:hidden p-2 transition-colors duration-500 ${isScrolled ? "text-[#4a3f35]" : "text-white"}`}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export const DesignIdeas = () => {
  return (
    <div
      className="min-h-screen text-gray-900 font-sans relative"
      style={{
        backgroundColor: "#D2B48C",
        // D2B48C
        backgroundImage: `
    linear-gradient(rgba(255,255,255,.03), rgba(255,255,255,.03)),
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.045) 0px,
      rgba(255,255,255,.045) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0,0,0,.035) 0px,
      rgba(0,0,0,.035) 1px,
      transparent 1px,
      transparent 3px
    )
  `,
        backgroundSize: "100% 100%, 3px 3px, 3px 3px",
      }}
    >
      <ThemeHeader />
      {/*  BannerImage Section */}
      <section className="relative w-full max-w-480 mx-auto overflow-hidden flex items-center justify-center">
        <img
          src={BannerImage}
          alt="Perfect Balance of Comfort"
          className="w-full h-auto object-cover"
          fetchPriority="high"
          // decoding="async"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center md:justify-end p-10 md:p-24 lg:p-32">
          <h2 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-white text-center md:text-right max-w-2xl leading-[1.05] tracking-tight">
            The Perfect
            <br />
            Balance of
            <br />
            Comfort
          </h2>
        </div>
      </section>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto">
        {/* Left Side: Orange with Text */}
        <div className="w-full md:w-1/2 bg-[#db6a40] text-white p-10 md:p-24 lg:p-32 flex flex-col justify-center min-h-[500px]">
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] mb-6 tracking-tight">
            Timeless
            <br />
            Furniture,
            <br />
            Made to
            <br />
            Last
          </h1>
        </div>
        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto min-h-[500px] relative">
          <img
            src={righesideimage}
            alt="Interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="md:w-1/3">
          <h2 className="text-2xl md:text-[2rem] font-bold text-[#4a3f35] leading-snug tracking-tight">
            A Brand Born from Passion for Design
          </h2>
        </div>
        <div className="md:w-2/3 text-gray-700 space-y-6 text-sm md:text-[0.95rem] leading-relaxed max-w-3xl">
          <p>
            At Nordform, we believe in the power of simplicity and
            functionality, inspired by the timeless elegance of Scandinavian
            design. Our furniture is crafted with the finest materials, offering
            a blend of minimalism and comfort to elevate every space. With a
            focus on clean lines, natural textures, and practical design, we
            create pieces that not only look beautiful but also stand the test
            of time.
          </p>
          <p>
            Rooted in the values of quality, sustainability, and innovation,
            Nordform brings the essence of Nordic living to your home. Whether
            you're furnishing a cozy apartment or a spacious living room, our
            carefully curated collection will transform your space into a
            sanctuary of style and serenity.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#e3dfd3] border border-[#e3dfd3]">
          {/* Category 1 */}
          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category1}
              alt="Kitchen"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Kitchen
            </h3>
          </div>
          {/* Category 2 */}
          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category2}
              alt="Bedroom"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Bedroom
            </h3>
          </div>
          {/* Category 3 */}
          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category3}
              alt="wardrobe"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Wardrobe
            </h3>
          </div>
          {/* Category 4 */}
          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category4}
              alt="Bathroom"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Bathroom
            </h3>
          </div>
          {/* Category 5 */}
          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category5}
              alt="Storage"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Kids Bedroom
            </h3>
          </div>
          {/* Category 6 */}

          <div className="bg-[#fcfaf5] p-12 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <img
              src={category6}
              alt="Rugs"
              className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-multiply mb-8 group-hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-sm md:text-base font-semibold text-[#4a3f35]">
              Rugs
            </h3>
          </div>
        </div>
      </section>

      {/* More Perspectives Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-32">
        <h2 className="text-2xl font-bold text-[#4a3f35] mb-8 tracking-tight">
          More perspectives
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[700px]">
          {/* Card 1: Green */}
          <div className="bg-[#a5b49a] p-8 md:p-10 flex flex-col h-[500px] lg:h-full overflow-hidden relative">
            <div className="z-10 text-[#2a3026] mb-8">
              <h3 className="text-2xl font-bold mb-4 leading-snug">
                Our Sustainable
                <br />
                Vision
              </h3>
              <p className="text-[0.85rem] leading-relaxed max-w-[280px]">
                At Nordform, we are committed to making thoughtful decisions
                that prioritize the wellbeing of people and the planet. From
                sourcing eco-conscious materials to ensuring responsible
                craftsmanship, sustainability is at the heart of everything we
                do.
              </p>
            </div>
            <div className="mt-auto -mx-8 -mb-10 relative h-[50%] lg:h-[45%] flex-grow">
              <img
                src={card1}
                alt="Sustainable Sofa"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Yellow */}
          <div className="flex flex-col h-[600px] lg:h-full gap-6">
            <div className="h-1/2 relative bg-gray-200">
              <img
                src={card2}
                alt="Timeless Elegance"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#f0e3bc] p-8 md:p-10 h-1/2 flex flex-col justify-center text-[#4a3f35]">
              <h3 className="text-2xl font-bold mb-4 leading-snug">
                Looking for
                <br />
                Timeless Elegance?
              </h3>
              <p className="text-[0.85rem] leading-relaxed max-w-[280px]">
                Explore our full range of furniture, crafted to bring beauty and
                functionality to any space.
              </p>
            </div>
          </div>

          {/* Card 3: Peach */}
          <div className="bg-[#e2a893] p-8 md:p-10 flex flex-col h-[550px] lg:h-full overflow-hidden relative">
            <div className="z-10 text-[#4a2e24] mb-8">
              <h3 className="text-2xl font-bold mb-4 leading-snug">
                Spare Parts
              </h3>
              <p className="text-[0.85rem] leading-relaxed max-w-[280px]">
                At Nordform, we believe in the longevity of design. That's why
                we offer spare parts for selected items to ensure your furniture
                remains functional and timeless. For assistance or purchases,
                reach out to us at customercare@nordform.com. Please note: Buyer
                assembly limits warranty to components only.
              </p>
            </div>
            <div className="mt-auto -mx-8 -mb-10 relative h-[45%] lg:h-[40%] flex-grow">
              <img
                src={card3}
                alt="Spare Parts"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <FaqSection theme="about" />
      <HomeFooter theme="about" />
    </div>
  );
};

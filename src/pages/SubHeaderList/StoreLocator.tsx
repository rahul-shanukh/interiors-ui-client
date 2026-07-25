import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FaqSection } from "../home/ui/FaqSection";
import { HomeFooter } from "../home/ui/HomeFooter";
import FloatWhatsapp from "../../features/communication/FloatWhatsapp";
import { MapPin, Phone, Mail, Clock, ExternalLink, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollState } from "../../shared/hooks/useScrollState";
import logo from "../../assets/logo/logo.jpeg";

const ThemeHeader = () => {
  const navigate = useNavigate();
  const isScrolled = useScrollState(20);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const primaryLinks = ["Design Ideas", "Projects", "Store Locator", "More"];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#fdfbf7] shadow-sm py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className={`cursor-pointer flex items-center gap-4 transition-colors duration-500 ${isScrolled ? 'text-[#4a3f35]' : 'text-white'}`}
        >
          <img
            src={logo}
            alt="East Interia Interiors"
            className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
          />
          <div className={`flex flex-col border-l pl-4 transition-colors duration-500 ${isScrolled ? 'border-[#4a3f35]/30' : 'border-white/30'}`}>
            <span className="text-2xl font-bold tracking-[0.15em] font-serif leading-none" style={{ fontFamily: "'Cinzel', serif" }}>East Interia</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.4em] mt-1.5" style={{ fontFamily: "'Cinzel', serif" }}>INTERIORS</span>
          </div>
        </div>

        {/* Desktop links - exclude Store Locator since we are currently on this page */}
        <nav className={`hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-500 ${isScrolled ? 'text-[#4a3f35]' : 'text-white/90'}`}>
          {primaryLinks.filter(link => link !== "Store Locator").map((link) => {
            const isDesignIdeas = link === "Design Ideas";
            const targetUrl = isDesignIdeas ? "/design-ideas" : `/#${link.toLowerCase().replace(" ", "-")}`;
            return (
              <a
                key={link}
                href={targetUrl}
                onClick={(e) => {
                  if (isDesignIdeas) {
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
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 transition-colors duration-500 ${isScrolled ? 'text-[#4a3f35]' : 'text-white'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#fdfbf7] shadow-lg border-t border-[#4a3f35]/10 md:hidden">
          <div className="px-6 py-6 space-y-4">
            {primaryLinks.filter(link => link !== "Store Locator").map((link) => {
              const isDesignIdeas = link === "Design Ideas";
              const targetUrl = isDesignIdeas ? "/design-ideas" : `/#${link.toLowerCase().replace(" ", "-")}`;
              return (
                <a
                  key={link}
                  href={targetUrl}
                  onClick={(e) => {
                    if (isDesignIdeas) {
                      e.preventDefault();
                    }
                    setIsMobileMenuOpen(false);
                    navigate(targetUrl);
                  }}
                  className="block text-sm font-semibold uppercase tracking-[0.15em] text-[#4a3f35] hover:opacity-60 transition-opacity"
                >
                  {link}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default function StoreLocator() {
  const mapLink = "https://maps.app.goo.gl/tJRjdE4KyX3JddX48";

  // Embed source URL derived from the Google Maps location coordinates for Charminar area, Hyderabad.
  const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.2020628478454!2d78.4745731!3d17.3540073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb981e4f77ffff%3A0x22739ecd400660e7!2sCharminar%20(Old%20City)%2C%20Hyderabad%2C%20Telangana%20500002!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  // Animation variants for Staggering info card children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
      },
    },
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a3f35] font-sans flex flex-col justify-between overflow-x-hidden">
      <ThemeHeader />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative h-[35vh] md:h-[45vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.65 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
            alt="East Interia Showroom Interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 z-10" />

          <div className="relative z-20 text-center px-4 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs md:text-sm font-semibold tracking-[0.4em] text-[#C5A059] uppercase block mb-3"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Experience Luxury In-Person
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-5xl font-serif text-white tracking-[0.15em] leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              East Interia Experience Centres
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="w-16 h-[2px] bg-[#C5A059] mx-auto origin-center"
            ></motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">

            {/* Showroom Details Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <motion.div variants={cardVariants}>
                <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                  Flagship Store
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-[#4a3f35] tracking-[0.1em]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                  Hyderabad Experience Centre
                </h2>
                <p className="text-[#6b5d50] text-sm mt-3 leading-relaxed max-w-xl font-medium tracking-wide">
                  Step into a world of architectural beauty and curated designs. Meet our design consultants, explore thousands of finishes, and design your dream space in real-time.
                </p>
              </motion.div>

              {/* Contact Information Cards */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >

                {/* Address Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                  className="p-6 bg-white border border-[#C5A059]/20 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-lg flex gap-4 transition-colors duration-300 cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#4a3f35] tracking-wide font-serif mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Location</h4>
                    <p className="text-xs text-[#6b5d50] leading-relaxed font-medium tracking-wide">
                      Charminar (Old City),<br />
                      Hyderabad, Telangana 500002
                    </p>
                  </div>
                </motion.div>

                {/* Open Hours Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                  className="p-6 bg-white border border-[#C5A059]/20 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-lg flex gap-4 transition-colors duration-300 cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#4a3f35] tracking-wide font-serif mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Opening Hours</h4>
                    <p className="text-xs text-[#6b5d50] leading-relaxed font-medium tracking-wide">
                      Mon - Sat: 10:00 AM - 8:00 PM<br />
                      Sunday: 11:00 AM - 5:00 PM
                    </p>
                  </div>
                </motion.div>

                {/* Contact Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                  className="p-6 bg-white border border-[#C5A059]/20 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-lg flex gap-4 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#4a3f35] tracking-wide font-serif mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Phone</h4>
                    <a href="tel:+919876543210" className="text-xs text-[#6b5d50] hover:text-[#C5A059] transition-colors duration-300 block mb-1 font-medium tracking-wide">
                      +91 98765 43210
                    </a>
                    <a href="tel:+919876543210" className="text-xs text-[#6b5d50] hover:text-[#C5A059] transition-colors duration-300 block font-medium tracking-wide">
                      +91 98765 43210
                    </a>
                  </div>
                </motion.div>

                {/* Email Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                  className="p-6 bg-white border border-[#C5A059]/20 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-lg flex gap-4 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#4a3f35] tracking-wide font-serif mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Email</h4>
                    <a href="mailto:hyderabad@East Interiainteriors.in" className="text-xs text-[#6b5d50] hover:text-[#C5A059] transition-colors duration-300 block mb-1 font-medium tracking-wide">
                      hyderabad@East Interiainteriors.in
                    </a>
                    <a href="mailto:info@East Interiainteriors.in" className="text-xs text-[#6b5d50] hover:text-[#C5A059] transition-colors duration-300 block font-medium tracking-wide">
                      info@East Interiainteriors.in
                    </a>
                  </div>
                </motion.div>

              </motion.div>

              {/* Direct Maps CTA Button */}
              <motion.div variants={cardVariants} className="pt-2">
                <motion.a
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    backgroundColor: "#C5A059",
                    color: "#ffffff",
                    borderColor: "#C5A059"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#C5A059] text-[#C5A059] shadow-[0_10px_25px_rgba(197,160,89,0.05)] hover:shadow-[0_10px_25px_rgba(197,160,89,0.2)] text-xs uppercase tracking-[0.2em] font-semibold font-serif cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Interactive Map Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", stiffness: 70, damping: 15 }}
              whileHover={{ boxShadow: "0 25px 60px rgba(197,160,89,0.15)", borderColor: "rgba(197, 160, 89, 0.5)" }}
              className="relative group w-full h-[400px] md:h-[500px] bg-white p-3 border border-[#C5A059]/20 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden transition-all duration-500"
            >
              {/* Outer decorative borders */}
              <div className="absolute inset-0 border border-[#C5A059]/20 rounded-2xl pointer-events-none group-hover:border-[#C5A059]/50 transition-colors duration-500 z-10 m-2"></div>

              <iframe
                title="East Interia Interiors Hyderabad Showroom Map"
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-xl z-0"
              ></iframe>
            </motion.div>

          </div>
        </section>

        {/* Benefits / Services section */}
        <section className="bg-[#fdfbf7] py-16 md:py-24 border-t border-b border-[#C5A059]/10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                At The Gallery
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-[#4a3f35] tracking-wide" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                What Awaits You Inside
              </h3>
              <p className="text-[#6b5d50] text-sm mt-3 tracking-wide">
                Experience a personalised walk-through with our modular interior specialists.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >

              {/* Benefit 1 */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 15px 35px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-[#C5A059]/20 flex flex-col items-center text-center group transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-serif font-semibold text-[#4a3f35] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>1-on-1 Consultation</h4>
                <p className="text-xs text-[#6b5d50] leading-relaxed font-medium tracking-wide">
                  Collaborate directly with our certified expert designers to plan and visualize layouts tailored to your exact taste.
                </p>
              </motion.div>

              {/* Benefit 2 */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 15px 35px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-[#C5A059]/20 flex flex-col items-center text-center group transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-semibold text-[#4a3f35] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Material & Finishes Library</h4>
                <p className="text-xs text-[#6b5d50] leading-relaxed font-medium tracking-wide">
                  Touch and compare hundreds of premium fabrics, laminates, marbles, and woods to build the perfect palette.
                </p>
              </motion.div>

              {/* Benefit 3 */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 15px 35px rgba(197, 160, 89, 0.08)", borderColor: "rgba(197, 160, 89, 0.4)" }}
                className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-[#C5A059]/20 flex flex-col items-center text-center group transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-semibold text-[#4a3f35] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Quality Guarantee</h4>
                <p className="text-xs text-[#6b5d50] leading-relaxed font-medium tracking-wide">
                  Inspect our robust cabinetry, kitchen fittings, and architectural components to witness our build quality standard.
                </p>
              </motion.div>

            </motion.div>
          </div>
        </section>
      </main>
      <FaqSection theme="about" />
      <HomeFooter theme="about" />
      <FloatWhatsapp />
    </div>
  );
}
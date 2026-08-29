import { memo } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

// 1. Hoist static data OUTSIDE the component to prevent memory reallocation on every render
const FOOTER_LINKS = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Process", href: "/process" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Modular Kitchen", href: "/services/kitchen" },
    { label: "Wardrobes", href: "/services/wardrobes" },
    { label: "Living Room", href: "/services/living-room" },
    { label: "Full Home", href: "/services/full-home" },
  ],
  Support: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Warranty", href: "/warranty" },
    { label: "FAQs", href: "/faqs" },
  ],
};

const SOCIAL_LINKS = [
  {
    id: "facebook",
    icon: FaFacebookF,
    href: "https://facebook.com",
    label: "Follow us on Facebook",
    colors: {
      default: "text-blue-600 hover:shadow-indigo-200",
      about: "text-blue-600 hover:shadow-[#C5A059]/20",
    },
  },
  {
    id: "instagram",
    icon: FaInstagram,
    href: "https://instagram.com",
    label: "Follow us on Instagram",
    colors: {
      default: "text-pink-500 hover:shadow-pink-200",
      about: "text-pink-500 hover:shadow-[#C5A059]/20",
    },
  },
  {
    id: "linkedin",
    icon: FaLinkedinIn,
    href: "https://linkedin.com",
    label: "Connect with us on LinkedIn",
    colors: {
      default: "text-blue-700 hover:shadow-blue-200",
      about: "text-blue-700 hover:shadow-[#C5A059]/20",
    },
  },
  {
    id: "whatsapp",
    icon: FaWhatsapp,
    href: "https://wa.me/yournumber",
    label: "Message us on WhatsApp",
    colors: {
      default: "text-green-500 hover:shadow-green-200",
      about: "text-green-500 hover:shadow-[#C5A059]/20",
    },
  },
  {
    id: "youtube",
    icon: FaYoutube, // Placeholder for YouTube icon
    href: "https://youtube.com",
    label: "Subscribe to our YouTube channel",
    colors: {
      default: "text-red-500 hover:shadow-red-200",
      about: "text-red-500 hover:shadow-[#C5A059]/20",
    },
  },
];

interface HomeFooterProps {
  theme?: "default" | "about";
}

// 2. Wrap in React.memo to prevent unnecessary re-renders of this large static component
export const HomeFooter = memo(({ theme = "default" }: HomeFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative pt-24 font-sans overflow-hidden ${
        theme === "about"
          ? "bg-[#fdfbf7] border-t border-[#4a3f35]/10 text-[#4a3f35]"
          : "bg-[#F6F7FB]"
      }`}
    >
      {/* Floating background blobs */}
      {theme !== "about" ? (
        <>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/40 blur-[120px] rounded-full -z-10" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-300/40 blur-[120px] rounded-full -z-10" />
        </>
      ) : (
        <>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4a3f35]/5 blur-[120px] rounded-full -z-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* CTA Banner */}
        {theme !== "about" && (
          <div
            className="mb-20 p-12 rounded-[40px] bg-linear-to-br from-[#E9ECFF] to-[#F7F8FF] 
            shadow-[15px_15px_40px_rgba(0,0,0,0.08),-15px_-15px_40px_rgba(255,255,255,0.9)] 
            relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-400/30 blur-[100px] rounded-full" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Ready to transform your space?
                </h3>
                <p className="text-gray-500">
                  Join 150+ happy families in Warangal & Hyderabad
                </p>
              </div>

              <button
                type="button"
                className="px-10 py-4 rounded-xl text-white font-semibold 
                bg-gradient-to-r from-indigo-500 to-blue-500 
                shadow-lg shadow-indigo-300/40 
                hover:scale-105 hover:shadow-xl 
                transition-all duration-300"
              >
                Get Free Consultation
              </button>
            </div>
          </div>
        )}

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-6">
              <span
                className={`text-3xl font-bold tracking-[0.1em] ${
                  theme === "about" ? "text-[#4a3f35]" : "text-gray-800"
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JC
              </span>
              <span
                className={`block text-[0.65rem] tracking-[0.35em] uppercase ${
                  theme === "about" ? "text-[#C5A059]" : "text-indigo-500"
                }`}
              >
                Interiors
              </span>
            </div>

            <p
              className={`text-sm leading-relaxed max-w-sm mb-8 ${
                theme === "about" ? "text-[#4a3f35]/70" : "text-gray-500"
              }`}
            >
              Crafting premium residential and commercial sanctuaries with
              artistic elegance and modern engineering.
            </p>

            {/* Config-driven Social Icons for DRY code and perfect A11y */}
            <nav aria-label="Social Media Links" className="flex gap-4">
              {SOCIAL_LINKS.map(({ id, icon: Icon, href, label, colors }) => (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white shadow-md hover:-translate-y-1 transition-all duration-300 ${colors[theme]}`}
                >
                  <Icon className={`text-lg ${colors.default.split(" ")[0]}`} />
                </a>
              ))}
            </nav>
          </div>

          {/* Dynamic Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={`${title} Directory`}>
              <h4
                className={`font-semibold text-sm uppercase tracking-widest mb-6 ${
                  theme === "about" ? "text-[#4a3f35]" : "text-gray-700"
                }`}
                style={
                  theme === "about" ? { fontFamily: "'Cinzel', serif" } : {}
                }
              >
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`text-sm hover:translate-x-1 inline-block transition-transform duration-200 ${
                        theme === "about"
                          ? "text-[#4a3f35]/70 hover:text-[#C5A059]"
                          : "text-gray-500 hover:text-indigo-500"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider ${
            theme === "about"
              ? "border-[#4a3f35]/10 text-[#4a3f35]/60"
              : "border-gray-200 text-gray-500"
          }`}
        >
          <p>© {currentYear} JC Interiors. All rights reserved.</p>

          <div className="flex gap-8">
            <a
              href="/locations/warangal"
              className={`transition-colors duration-200 ${
                theme === "about"
                  ? "hover:text-[#C5A059]"
                  : "hover:text-indigo-500"
              }`}
            >
              Warangal
            </a>
            <a
              href="/locations/hyderabad"
              className={`transition-colors duration-200 ${
                theme === "about"
                  ? "hover:text-[#C5A059]"
                  : "hover:text-indigo-500"
              }`}
            >
              Hyderabad
            </a>
            <span
              className={`font-semibold ${
                theme === "about" ? "text-[#C5A059]" : "text-indigo-500"
              }`}
            >
              Design by JC
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

HomeFooter.displayName = "HomeFooter";

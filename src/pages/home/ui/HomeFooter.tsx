import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

export const HomeFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ["About Us", "Our Process", "Careers", "Contact"],
    Services: ["Modular Kitchen", "Wardrobes", "Living Room", "Full Home"],
    Support: ["Privacy Policy", "Terms of Use", "Warranty", "FAQs"],
  };

  return (
    <footer className="relative bg-[#F6F7FB] pt-24 font-sans overflow-hidden">
      {/* Floating background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/40 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-300/40 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* CTA Banner */}
        <div
          className="mb-20 p-12 rounded-[40px] bg-gradient-to-br from-[#E9ECFF] to-[#F7F8FF]
          shadow-[15px_15px_40px_rgba(0,0,0,0.08),-15px_-15px_40px_rgba(255,255,255,0.9)]
          relative overflow-hidden"
        >
          {/* soft glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-400/30 blur-[100px] rounded-full"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Ready to transform your space?
              </h3>

              <p className="text-gray-500">
                Join 150+ happy families in Warangal & Hyderabad
              </p>
            </div>

            {/* Premium CTA */}
            <button
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

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-6">
              <span
                className="text-3xl font-bold tracking-[0.1em] text-gray-800"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JC
              </span>

              <span className="block text-[0.65rem] tracking-[0.35em] text-indigo-500 uppercase">
                Interiors
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              Crafting premium residential and commercial sanctuaries with
              artistic elegance and modern engineering.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-11 h-11 rounded-xl flex items-center justify-center
                bg-white shadow-md hover:shadow-indigo-200
                hover:-translate-y-1 transition-all duration-300"
              >
                <FaFacebookF className="text-blue-600 text-lg" />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl flex items-center justify-center
                bg-white shadow-md hover:shadow-pink-200
                hover:-translate-y-1 transition-all duration-300"
              >
                <FaInstagram className="text-pink-500 text-lg" />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl flex items-center justify-center
                bg-white shadow-md hover:shadow-blue-200
                hover:-translate-y-1 transition-all duration-300"
              >
                <FaLinkedinIn className="text-blue-700 text-lg" />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl flex items-center justify-center
                bg-white shadow-md hover:shadow-green-200
                hover:-translate-y-1 transition-all duration-300"
              >
                <FaWhatsapp className="text-green-500 text-lg" />
              </a>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-widest mb-6">
                {title}
              </h4>

              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 text-sm hover:text-indigo-500 hover:translate-x-1 transition-all duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-gray-200 py-8 flex flex-col md:flex-row 
          justify-between items-center gap-4 text-xs text-gray-500 tracking-wider"
        >
          <p>© {currentYear} JC Interiors. All rights reserved.</p>

          <div className="flex gap-8">
            <span className="hover:text-indigo-500 cursor-pointer">
              Warangal
            </span>

            <span className="hover:text-indigo-500 cursor-pointer">
              Hyderabad
            </span>

            <span className="font-semibold text-indigo-500">Design by JC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

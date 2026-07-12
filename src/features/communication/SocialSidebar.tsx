import React from "react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SocialSidebar() {
  const socials = [
    {
      name: "Facebook",
      icon: <FaFacebook size={26} color="#1877F2" />,
      url: "https://facebook.com",
      // shadow: "hover:drop-shadow-[0_0_12px_rgba(24,119,242,0.8)]",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={26} color="#E1306C" />,
      url: "https://instagram.com",
      // shadow: "hover:drop-shadow-[0_0_12px_rgba(225,48,108,0.8)]",
    },
    {
      name: "YouTube",
      icon: <FaYoutube size={26} color="#FF0000" />,
      url: "https://youtube.com",
      // shadow: "hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]",
    },
  ];

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 py-8 px-4 bg-white/70 backdrop-blur-xl border-y border-r border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-tr-[2rem] rounded-br-[2rem]"
    >
      {socials.map((social) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center"
          aria-label={`Visit our ${social.name}`}
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
}

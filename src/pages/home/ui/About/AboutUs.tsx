import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useScroll, animate } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useScrollState } from '../../../../shared/hooks/useScrollState';
import logo from '../../../../assets/logo/logo.jpeg';
import { HomeFooter } from '../HomeFooter';
import { FaqSection } from '../FaqSection';
import { ConsultOnlineModal } from '../../../../features/consult-online/ui/ConsultOnlineModal';

import bannerImage from '../../../../assets/about/aboutUs_image.avif';
import architectImage from '../../../../assets/about/architect_image.avif';
import consultImage from '../../../../assets/about/hero_living_room.png';

const MotionPortrait: React.FC = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const smoothX = useSpring(x, springConfig);
    const smoothY = useSpring(y, springConfig);

    // Subtle 3D tilt: up to 8 degrees
    const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

    // Inner image parallax (moving opposite direction to create depth)
    const imgX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
    const imgY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

    // Dynamic shift of the gold border backdrop (moving with mouse slightly)
    const borderX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
    const borderY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

    // Cursor crosshairs tracking relative percentages
    const cursorLeft = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
    const cursorTop = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ xRel: 0, yRel: 0, rx: 0, ry: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left - width / 2;
        const mouseY = event.clientY - rect.top - height / 2;

        const xFraction = mouseX / width;
        const yFraction = mouseY / height;

        x.set(xFraction);
        y.set(yFraction);

        setCoords({
            xRel: parseFloat(xFraction.toFixed(3)),
            yRel: parseFloat((-yFraction).toFixed(3)),
            rx: parseFloat((yFraction * -8).toFixed(1)),
            ry: parseFloat((xFraction * 8).toFixed(1)),
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
        setCoords({ xRel: 0, yRel: 0, rx: 0, ry: 0 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            className="lg:col-span-5 relative select-none cursor-pointer"
            style={{ perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {/* Compass backdrop SVG that rotates slowly */}
            <motion.svg
                className="absolute -top-16 -right-16 w-52 h-52 text-white/10 pointer-events-none z-0"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 1.5" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.3" />
                <line x1="18.2" y1="18.2" x2="81.8" y2="81.8" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 1" />
                <line x1="18.2" y1="81.8" x2="81.8" y2="18.2" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 1" />
                <text x="50" y="9" textAnchor="middle" fontSize="3.5" fill="currentColor" opacity="0.6" fontFamily="monospace">N</text>
                <text x="91" y="51" textAnchor="middle" fontSize="3.5" fill="currentColor" opacity="0.6" fontFamily="monospace">E</text>
                <text x="50" y="93" textAnchor="middle" fontSize="3.5" fill="currentColor" opacity="0.6" fontFamily="monospace">S</text>
                <text x="9" y="51" textAnchor="middle" fontSize="3.5" fill="currentColor" opacity="0.6" fontFamily="monospace">W</text>
            </motion.svg>

            {/* Grid blueprint backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] rounded-sm transform translate-z-[-20px]"
            />

            {/* Top and Left Architectural Ruler Marks */}
            <div className="absolute -top-4 left-0 right-0 h-3 flex justify-between px-2 text-[7px] text-white/50 font-mono pointer-events-none">
                <span>0.00m</span>
                <span>0.25m</span>
                <span>0.50m</span>
                <span>0.75m</span>
                <span>1.00m</span>
            </div>
            <div className="absolute -top-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <div className="absolute -left-5 top-0 bottom-0 w-3 flex flex-col justify-between py-2 text-[7px] text-white/50 font-mono pointer-events-none">
                <span>0.0</span>
                <span>0.3</span>
                <span>0.6</span>
                <span>0.9</span>
                <span>1.2</span>
            </div>
            <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none" />

            {/* Offset Gold Border Backdrop (reacts dynamically to hover and mouse positioning) */}
            <motion.div
                className="absolute -bottom-4 -left-4 w-full h-full border border-white/30 z-0 rounded-sm"
                style={{
                    x: borderX,
                    y: borderY,
                }}
            />

            {/* Main Image Wrapper with 3D Tilt (using dark contrast background) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden aspect-[4/5] rounded-sm z-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] bg-[#1E150F]"
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Dotted Coordinate Crosshairs (follow mouse) */}
                <motion.div
                    className="absolute top-0 bottom-0 border-l border-dashed border-white/40 z-20 pointer-events-none"
                    style={{ left: cursorLeft }}
                    animate={{ opacity: isHovered ? 0.8 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute left-0 right-0 border-t border-dashed border-white/40 z-20 pointer-events-none"
                    style={{ top: cursorTop }}
                    animate={{ opacity: isHovered ? 0.8 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Parallax Image (sized slightly larger to cover motion boundaries) */}
                <motion.img
                    src={architectImage}
                    alt="Ananya Sharma - Founder of East Interia"
                    className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                    style={{
                        x: imgX,
                        y: imgY,
                        scale: 1.1,
                        transformStyle: 'preserve-3d',
                    }}
                />

                {/* Dark artistic gold-hued overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E150F]/90 via-transparent to-transparent opacity-75 pointer-events-none"></div>

                {/* Golden light sweep sheen overlay on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                    style={{
                        skewX: -20,
                        scale: 1.5,
                    }}
                    animate={isHovered ? {
                        x: ['-100%', '200%'],
                    } : {
                        x: '-100%',
                    }}
                    transition={{
                        duration: 1.6,
                        ease: "easeInOut",
                        repeat: isHovered ? Infinity : 0,
                        repeatDelay: 0.4
                    }}
                />

                {/* Real-time coordinates overlay (HUD) */}
                <div className="absolute top-3 left-3 bg-[#1E150F]/85 backdrop-blur-xs border border-white/20 px-2 py-1 text-[7px] text-white font-mono rounded-xs z-30 pointer-events-none select-none flex flex-col gap-0.5">
                    <div>[SYS: STANDBY]</div>
                    <div>[GRID_LOC: X:{(coords.xRel >= 0 ? "+" : "") + coords.xRel.toFixed(2)} Y:{(coords.yRel >= 0 ? "+" : "") + coords.yRel.toFixed(2)}]</div>
                    <div>[TILT: RX:{coords.rx.toFixed(1)}° RY:{coords.ry.toFixed(1)}°]</div>
                </div>

                {/* Live technical scale in bottom left */}
                <div className="absolute bottom-3 left-3 text-[7px] text-white/60 font-mono z-30 pointer-events-none">
                    SCALE 1:25 // DESIGNERISTIC MODE
                </div>
            </motion.div>

            {/* Gold Corner Accents - slide outward on hover */}
            <motion.div
                className="absolute w-4 h-4 border-t border-r border-white/60 z-20 pointer-events-none"
                animate={{
                    top: isHovered ? -6 : 8,
                    right: isHovered ? -6 : 8,
                    opacity: isHovered ? 1 : 0.6,
                }}
                transition={{ type: 'spring', ...springConfig }}
            />
            <motion.div
                className="absolute w-4 h-4 border-b border-l border-white/60 z-20 pointer-events-none"
                animate={{
                    bottom: isHovered ? -6 : 8,
                    left: isHovered ? -6 : 8,
                    opacity: isHovered ? 1 : 0.6,
                }}
                transition={{ type: 'spring', ...springConfig }}
            />

            {/* Studio Director Badge that floats and fades in on hover */}
            <motion.div
                className="absolute bottom-6 right-6 bg-white text-black font-semibold text-[9px] tracking-[0.25em] uppercase py-1.5 px-3 rounded-xs z-20 shadow-md font-sans"
                animate={{
                    y: isHovered ? -4 : 8,
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.9,
                }}
                transition={{ type: 'spring', ...springConfig }}
            >
                Studio Director
            </motion.div>
        </div>
    );
};

const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const numericPart = parseInt(value.replace(/\D/g, ''));
    const nonNumericPart = value.replace(/\d/g, '');

    // Create a MotionValue starting at 0
    const count = useMotionValue(0);
    // Transform and round the MotionValue
    const rounded = useTransform(count, (latest) => Math.round(latest));
    // Ref to ensure the animation only runs once
    const hasAnimated = useRef(false);

    const handleViewportEnter = () => {
        if (!hasAnimated.current) {
            hasAnimated.current = true;
            animate(count, numericPart, {
                duration: 2.0,
                ease: "easeOut"
            });
        }
    };

    return (
        <motion.span
            onViewportEnter={handleViewportEnter}
            viewport={{ once: true, margin: "-100px" }}
        >
            <motion.span>{rounded}</motion.span>
            {nonNumericPart}
        </motion.span>
    );
};

const primaryLinks = ["Design Ideas", "Projects", "Store Locator", "More"];

export const AboutUs: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: stats = [] } = useQuery({
        queryKey: ["aboutStats"],
        queryFn: async () => [
            { number: '12+', label: 'Years Experience' },
            { number: '250+', label: 'Projects Completed' },
            { number: '15', label: 'Design Awards' },
            { number: '100%', label: 'Client Satisfaction' }
        ],
        initialData: [
            { number: '12+', label: 'Years Experience' },
            { number: '250+', label: 'Projects Completed' },
            { number: '15', label: 'Design Awards' },
            { number: '100%', label: 'Client Satisfaction' }
        ]
    });
    const isScrolled = useScrollState(10);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const ctaSectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: ctaScrollProgress } = useScroll({
        target: ctaSectionRef,
        offset: ["start end", "end start"]
    });
    const ctaBgY = useTransform(ctaScrollProgress, [0, 1], ["-12%", "12%"]);

    return (
        <>
            <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#fdfbf7] shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <div
                        onClick={() => navigate('/')}
                        className={`cursor-pointer flex items-center gap-4 transition-colors duration-500 ${isScrolled ? 'text-[#4a3f35]' : 'text-white'}`}
                    >
                        <img
                            src={logo}
                            alt="East Interia"
                            className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
                        />
                        <div className={`flex flex-col border-l pl-4 transition-colors duration-500 ${isScrolled ? 'border-[#4a3f35]/30' : 'border-white/30'}`}>
                            <span className="text-2xl font-bold tracking-[0.15em] font-serif leading-none" style={{ fontFamily: "'Cinzel', serif" }}>East Interia</span>
                            <span className="text-[0.65rem] font-semibold tracking-[0.4em] mt-1.5" style={{ fontFamily: "'Cinzel', serif" }}>INTERIORS</span>
                        </div>
                    </div>

                    <nav className={`hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-500 ${isScrolled ? 'text-[#4a3f35]' : 'text-white/90'}`}>
                        {primaryLinks.filter(link => link).map((link) => {
                            const isDesignIdeas = link === "Design Ideas";
                            const isStoreLocator = link === "Store Locator";
                            const targetUrl = isDesignIdeas
                                ? "/design-ideas"
                                : isStoreLocator
                                    ? "/store-locator"
                                    : `/#${link.toLowerCase().replace(" ", "-")}`;
                            return (
                                <a
                                    key={link}
                                    href={targetUrl}
                                    onClick={(e) => {
                                        if (isDesignIdeas || isStoreLocator) {
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
                        {isMobileMenuOpen ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-[#fdfbf7] shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[60vh] border-t border-[#4a3f35]/10" : "max-h-0"
                        }`}
                >
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {primaryLinks.filter(link => link).map((link) => {
                            const isDesignIdeas = link === "Design Ideas";
                            const targetUrl = isDesignIdeas ? "/design-ideas" : `/#${link.toLowerCase().replace(" ", "-")}`;
                            return (
                                <a
                                    key={link}
                                    href={targetUrl}
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        if (isDesignIdeas) {
                                            e.preventDefault();
                                            navigate(targetUrl);
                                        }
                                    }}
                                    className="text-sm font-medium text-[#4a3f35] uppercase tracking-wider py-2 border-b border-[#4a3f35]/5"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {link}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] md:min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Cinematic Reveal */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img
                        src={bannerImage}
                        alt="Luxurious Scandinavian Interior"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.15, opacity: 0.9 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2.2, ease: [0.25, 1, 0.5, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
                </div>

                {/* Content with Elegant Framer Motion Reveals */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center mt-12 md:mt-0"
                >
                    {/* Our Story with Slide Reveal Mask */}
                    <div className="relative overflow-hidden inline-block px-4 mb-3 sm:mb-4">
                        <motion.span
                            className="text-[#C5A059] text-xs sm:text-sm font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase block"
                            style={{ fontFamily: "'Cinzel', serif" }}
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
                            }}
                        >
                            Our Story
                        </motion.span>
                        <motion.div
                            className="absolute inset-0 bg-[#C5A059] z-20"
                            initial={{ left: "0%", width: "0%" }}
                            animate={{
                                left: ["0%", "0%", "100%"],
                                width: ["0%", "100%", "0%"]
                            }}
                            transition={{
                                times: [0, 0.4, 1],
                                duration: 1.1,
                                ease: [0.76, 0, 0.24, 1],
                                delay: 0.1
                            }}
                        />
                    </div>

                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-wide leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                        style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                    >
                        <span className="block overflow-hidden relative pb-1">
                            <motion.span
                                className="block"
                                variants={{
                                    hidden: { y: "110%", opacity: 0 },
                                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.4 } }
                                }}
                            >
                                “Your home should be a story
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden relative pb-1">
                            <motion.span
                                className="block"
                                variants={{
                                    hidden: { y: "110%", opacity: 0 },
                                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.6 } }
                                }}
                            >
                                of who you are,
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden relative pb-1">
                            <motion.span
                                className="block"
                                variants={{
                                    hidden: { y: "110%", opacity: 0 },
                                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.8 } }
                                }}
                            >
                                and a collection of what you love.”
                            </motion.span>
                        </span>
                    </h1>
                </motion.div>
            </section>

            {/* Welcome Intro Section (Below Background Image) */}
            <section className="py-24 px-6 md:px-12 bg-[#fdfbf7] text-center relative overflow-hidden border-b border-[#13503B]/5">
                {/* Subtle top gold accent line with expand animation */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#C5A059] origin-center"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="max-w-4xl mx-auto flex flex-col items-center"
                >
                    {/* Small luxury brand label */}
                    <motion.span
                        className="text-[#C5A059] text-xs font-semibold tracking-[0.4em] uppercase mb-6 block"
                        style={{ fontFamily: "'Cinzel', serif" }}
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                    >
                        Welcome to East Interia
                    </motion.span>

                    {/* Large editorial paragraph */}
                    <div className="overflow-hidden py-1">
                        <motion.p
                            className="text-[#13503B] text-lg sm:text-xl md:text-2xl font-light tracking-wide leading-relaxed max-w-3xl"
                            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                            variants={{
                                hidden: { opacity: 0, y: 25 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
                            }}
                        >
                            “We believe your space should be a reflection of your finest tastes—blending sophisticated <span className="text-[#C5A059] font-normal not-italic">Scandinavian minimalism</span> with rich, <span className="text-[#C5A059] font-normal not-italic">emerald-hued opulence</span>.”
                        </motion.p>
                    </div>

                    {/* Small ornamental diamond shape */}
                    <motion.div
                        className="flex items-center gap-2 mt-8"
                        variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                    >
                        <span className="w-1.5 h-1.5 bg-[#C5A059] rotate-45"></span>
                        <span className="w-8 h-[1px] bg-[#C5A059]/30"></span>
                        <span className="w-1.5 h-1.5 bg-[#C5A059] rotate-45"></span>
                    </motion.div>
                </motion.div>
            </section>

            {/* Meet the Founder Section */}
            <section className="py-32 px-6 md:px-12 bg-gradient-to-br from-[#B38F4D] via-[#C5A059] to-[#997632] text-white relative overflow-hidden">
                {/* Subtle Luxury Gold Glow Radial background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25)_0%,transparent_60%)] pointer-events-none"></div>

                {/* Technical blueprint floor plans in background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10 overflow-hidden text-white">
                    <svg className="absolute -top-10 left-[10%] w-96 h-96 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.15">
                        <rect x="10" y="10" width="80" height="80" />
                        <line x1="10" y1="40" x2="90" y2="40" />
                        <line x1="40" y1="10" x2="40" y2="90" />
                        <circle cx="40" cy="40" r="12" />
                        <path d="M 60 10 L 60 40 M 60 60 L 60 90" />
                        <circle cx="60" cy="50" r="4" />
                    </svg>
                    <svg className="absolute bottom-5 right-[8%] w-80 h-80 text-white rotate-45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.15">
                        <polygon points="50,5 95,95 5,95" />
                        <line x1="50" y1="5" x2="50" y2="95" />
                        <circle cx="50" cy="65" r="22" />
                        <line x1="10" y1="65" x2="90" y2="65" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

                    {/* Left: Founder's Portrait with Dynamic Motion Graphics Frame */}
                    <MotionPortrait />

                    {/* Right: Text / Biography (Luxury editorial spacing) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1
                                }
                            }
                        }}
                        className="lg:col-span-7 flex flex-col justify-center lg:pl-8"
                    >
                        <motion.span
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="text-white/90 text-xs font-semibold tracking-[0.4em] uppercase mb-4 block"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            The Visionary
                        </motion.span>

                        {/* Name with Slide Reveal Block Mask */}
                        <div className="relative overflow-hidden inline-block pr-6 max-w-fit mb-2">
                            <motion.h2
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
                                }}
                            >
                                Ananya Sharma
                            </motion.h2>
                            {/* Slide reveal block */}
                            <motion.div
                                className="absolute inset-0 bg-white z-20"
                                initial={{ left: "0%", width: "0%" }}
                                whileInView={{
                                    left: ["0%", "0%", "100%"],
                                    width: ["0%", "100%", "0%"]
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    times: [0, 0.4, 1],
                                    duration: 1.1,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.1
                                }}
                            />
                        </div>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="text-white/90 text-xs md:text-sm tracking-[0.25em] uppercase font-medium mb-8"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Founder & Principal Designer
                        </motion.p>

                        {/* Elegant Pull-Quote with Large Watermark Quote Marks and animated border */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="relative border-l-2 border-white/60 pl-8 my-8 py-2"
                        >
                            <span className="absolute -top-8 -left-3 text-white/15 text-[9rem] font-serif leading-none select-none pointer-events-none">“</span>
                            <p
                                className="text-lg md:text-xl text-white/95 font-light leading-relaxed italic"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                A space should not just look beautiful; it should feel like a whisper of luxury and a physical sigh of relief.
                            </p>
                        </motion.div>

                        <div className="space-y-6 text-white/80 font-light text-sm md:text-base leading-relaxed max-w-2xl">
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                            >
                                Ananya founded East Interia to redefine the boundaries of bespoke luxury living. Holding a Master’s in Architecture & Design from Stockholm, she merges clean Scandinavian functionality with the dramatic, warm textures of classical Indian heritage.
                            </motion.p>
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                            >
                                Under her creative direction, the studio approaches interior design as a form of high art—where spatial choreography, material authenticity, and tailored lighting converge to elevate daily living into a sensory experience.
                            </motion.p>
                        </div>

                        {/* Signature & Atelier Details */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                            }}
                            className="mt-12 pt-8 border-t border-white/20 flex items-center justify-between"
                        >
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] text-white/80 uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>Bespoke Creations</span>
                                <span className="text-sm font-semibold text-white mt-1">East Interia </span>
                            </div>

                            {/* Premium SVG Custom Signature with Live Drawing Effect */}
                            <div className="flex flex-col items-end">
                                <svg className="h-12 w-40 text-white opacity-90 transition-opacity duration-500 hover:opacity-100" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <motion.path
                                        d="M15 42 C 35 12, 48 48, 65 24 C 82 8, 88 52, 98 28 C 108 12, 112 42, 128 32 C 145 22, 155 8, 185 16 M85 36 L 175 34"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Statistics / Milestones */}
            <section className="w-full bg-gradient-to-br from-[#B38F4D] via-[#C5A059] to-[#997632] py-20 px-6 relative overflow-hidden">
                {/* Subtle Background Pattern/Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)] pointer-events-none"></div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                            }}
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                            className="flex flex-col items-center justify-center space-y-2 group cursor-pointer"
                        >
                            <span
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center tracking-tight"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                <AnimatedCounter value={stat.number} />
                            </span>
                            <span className="text-white/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium group-hover:text-white transition-colors duration-300">
                                {stat.label}
                            </span>
                            <div className="w-0 h-[1px] bg-white group-hover:w-12 transition-all duration-500 ease-out mt-1" />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Our Approach Section */}
            <section className="py-24 px-6 md:px-12 max-w-[1920px] mx-auto bg-white relative overflow-hidden">
                <div className="text-center mb-16">
                    <span
                        className="text-[#C5A059] text-xs font-semibold tracking-[0.4em] uppercase mb-4 block"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Our Process
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-[#A37E3A]"
                        style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                    >
                        The Art of Consulting
                    </h2>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Subtle dotted connector line behind cards (desktop only) */}
                    <div className="absolute top-[70px] left-[10%] right-[10%] h-[1px] hidden md:block z-0 overflow-hidden">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            className="w-full h-full border-t border-dashed border-[#C5A059]/40 origin-left"
                        />
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
                    >
                        {[
                            {
                                title: '1. Vision & Consultation',
                                description: 'We begin by understanding your lifestyle, preferences, and the inherent character of your space. This deep-dive ensures our concepts align perfectly with your daily life.',
                                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                            },
                            {
                                title: '2. Design & Curation',
                                description: 'Our team develops intricate 3D models, selects premium materials, and curates bespoke furnishings to craft a cohesive, luxurious aesthetic tailored just for you.',
                                icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                            },
                            {
                                title: '3. Execution & Delivery',
                                description: 'From procurement to final installation, our project managers oversee every detail, ensuring a seamless transformation and an immaculate final reveal.',
                                icon: 'M5 13l4 4L19 7'
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
                                }}
                                whileHover={{ y: -8 }}
                                className="bg-[#fdfbf7] p-10 rounded-sm border border-[#C5A059]/15 hover:border-[#C5A059]/50 hover:shadow-xl transition-all duration-500 group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C5A059] transition-colors duration-500">
                                    <svg className="w-6 h-6 text-[#C5A059] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <motion.path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d={step.icon}
                                            initial={{ pathLength: 0.3 }}
                                            whileHover={{ pathLength: 1 }}
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#A37E3A] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {step.title}
                                </h3>
                                <p className="text-[#4a3f35]/70 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                ref={ctaSectionRef}
                className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden"
            >
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <motion.img
                        src={consultImage}
                        alt="Consultation CTA"
                        className="absolute inset-0 w-full h-[125%] object-cover -top-[12.5%] brightness-75"
                        style={{ y: ctaBgY }}
                    />

                    {/* Black Overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                            },
                        },
                    }}
                    className="relative z-10 max-w-3xl mx-auto px-6 text-center"
                >
                    {/* Heading */}
                    <motion.h2
                        variants={{
                            hidden: {
                                opacity: 0,
                                y: 30,
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.8,
                                    ease: "easeOut",
                                },
                            },
                        }}
                        className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                        }}
                    >
                        Ready to Transform Your Space?
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        variants={{
                            hidden: {
                                opacity: 0,
                                y: 20,
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.8,
                                    ease: "easeOut",
                                },
                            },
                        }}
                        className="text-white/90 text-base md:text-lg leading-8 max-w-2xl mx-auto mb-10 font-light drop-shadow-md"
                    >
                        Schedule a private consultation with our experts and begin the
                        journey toward your dream interior.
                    </motion.p>

                    {/* Button */}
                    <motion.button
                        variants={{
                            hidden: {
                                opacity: 0,
                                scale: 0.95,
                            },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    duration: 0.6,
                                    ease: "easeOut",
                                },
                            },
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 10px 35px rgba(197, 160, 89, 0.4)",
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        onClick={() => queryClient.setQueryData(["consultModalOpen"], true)}
                        className="
                px-10
                py-4
                border
                border-white
                text-white
                uppercase
                tracking-[0.25em]
                text-xs
                md:text-sm
                font-semibold
                bg-transparent
                transition-all
                duration-500
                hover:bg-[#C5A059]
                hover:border-[#C5A059]
                hover:text-white
                rounded-sm
            "
                    >
                        Get A Free Quote
                    </motion.button>
                </motion.div>
            </section>
            <FaqSection theme="about" />
            <HomeFooter theme="about" />
            <ConsultOnlineModal />
        </>
    )
}

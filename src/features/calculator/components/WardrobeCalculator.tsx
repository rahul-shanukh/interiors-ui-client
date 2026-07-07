import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { useQuote } from "../../../entities/quote/hooks/useQuoteMutation";
import type {
  QuoteRequest,
  CustomerDetails,
} from "../../../entities/quote/model/quote.types";
import { QuoteContactStep } from "./reuse_components/QuoteContactStep";
import slideDoorImg from "../../../assets/slidingdoor.png";
import swingDoorImg from "../../../assets/swingdoor.png";
import walkInWardrobeImg from "../../../assets/walkinwardrobe.png";

import laminateImg from "../../../assets/laminate.png";
import acrylicImg from "../../../assets/acrylic.png";
import glassImg from "../../../assets/glass.png";
import puFinishImg from "../../../assets/pufinish.png";
import veneerImg from "../../../assets/veneer.png";

import PlywoodImg from "../../../assets/plywood.png";
import HDHMRImg from "../../../assets/hdhmr.png";
import MDFImg from "../../../assets/mdf.png";
import ParticleBoardImg from "../../../assets/particleboard.png";

import drawersImg from "../../../assets/drawers.png";
import shoeRackImg from "../../../assets/shoerack.png";
import jewelleryOrganizerImg from "../../../assets/jewelleryorganizer.png";
import mirrorImg from "../../../assets/mirror.png";
import ledLightingImg from "../../../assets/ledlighting.png";
import softCloseHingesImg from "../../../assets/softclosehinges.png";
import tieHolderImg from "../../../assets/tieholder.png";
import trouserPullOutImg from "../../../assets/trouserpullout.png";

// Configurable Options
const LENGTHS = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];
const HEIGHTS = ["3", "4", "5", "6", "7", "8", "9", "Ceiling Height"];

const TYPES = [
  {
    id: "Swing Door",
    name: "Swing Door",
    desc: "Classic hinged doors offering complete access to the cabinet.",
    image: swingDoorImg,
  },
  {
    id: "Sliding Door",
    name: "Sliding Door",
    desc: "Sleek sliding mechanism, space-saving for modern bedrooms.",
    image: slideDoorImg,
  },
  {
    id: "Walk-in Wardrobe",
    name: "Walk-in Wardrobe",
    desc: "Open-plan luxury dressing space with partition layouts.",
    image: walkInWardrobeImg,
  },
];

const FINISHES = [
  {
    id: "Laminate",
    name: "Laminate",
    desc: "Matte or glossy protective overlays, scratch-resistant, daily-use robust.",
    tag: "Standard",
    image: laminateImg,
  },
  {
    id: "Acrylic",
    name: "Acrylic",
    desc: "Mirror-like ultra-glossy finish, stain-resistant premium visuals.",
    tag: "Premium",
    image: acrylicImg,
  },
  {
    id: "Glass",
    name: "Glass",
    desc: "Tinted transparent or reflective backing, high-end reflection aesthetic.",
    tag: "Premium",
    image: glassImg,
  },
  {
    id: "PU Finish",
    name: "PU Finish",
    desc: "Premium seamless spray paint finish, customizable colors, luxurious silk feel.",
    tag: "Luxury",
    image: puFinishImg,
  },
  {
    id: "Veneer",
    name: "Veneer",
    desc: "Natural wood sheet overlay, polished for an authentic, warm premium look.",
    tag: "Luxury",
    image: veneerImg,
  },
];

const MATERIALS = [
  {
    id: "Plywood",
    name: "Plywood",
    desc: "High tensile strength, water-resistant core, extremely durable.",
    badge: "Excellent Durability",
    image: PlywoodImg,
  },
  {
    id: "HDHMR",
    name: "HDHMR",
    desc: "High Density High Moisture Resistant, superior termite and water resistance.",
    badge: "Highest Durability",
    image: HDHMRImg,
  },
  {
    id: "MDF",
    name: "MDF",
    desc: "Medium Density Fiberboard, ultra-smooth surface, ideal for clean finishes.",
    badge: "Moderate Durability",
    image: MDFImg,
  },
  {
    id: "Particle Board",
    name: "Particle Board",
    desc: "Eco-friendly, lightweight wood panels, best for light usage.",
    badge: "Standard Durability",
    image: ParticleBoardImg,
  },
];

const ACCESSORIES = [
  {
    id: "Drawers",
    name: "Drawers",
    desc: "Convenient pull-out drawers for folded clothing.",
    image: drawersImg,
  },
  {
    id: "Shoe Rack",
    name: "Shoe Rack",
    desc: "Dedicated shelving to keep your footwear organized.",
    image: shoeRackImg,
  },
  {
    id: "Jewellery Organizer",
    name: "Jewellery Organizer",
    desc: "Velvet-lined compartment for accessories.",
    image: jewelleryOrganizerImg,
  },
  {
    id: "Mirror",
    name: "Mirror",
    desc: "Integrated full-length mirror for styling.",
    image: mirrorImg,
  },
  {
    id: "LED Lighting",
    name: "LED Lighting",
    desc: "Warm sensored lighting inside the wardrobe.",
    image: ledLightingImg,
  },
  {
    id: "Soft Close Hinges",
    name: "Soft Close Hinges",
    desc: "Hinges that prevent slamming and close silently.",
    image: softCloseHingesImg,
  },
  {
    id: "Tie Holder",
    name: "Tie Holder",
    desc: "Dedicated slide-out holder for ties and belts.",
    image: tieHolderImg,
  },
  {
    id: "Trouser Pull-Out",
    name: "Trouser Pull-Out",
    desc: "Crease-free multi-tier trouser hanging rack.",
    image: trouserPullOutImg,
  },
  {
    id: "Loft Storage",
    name: "Loft Storage",
    desc: "Top-level cabinets for suitcases and seasonal items.",
    image: walkInWardrobeImg,
  },
  {
    id: "Hanging Rod",
    name: "Hanging Rod",
    desc: "Sturdy rod for hanging shirts, coats, and dresses.",
    image: swingDoorImg,
  },
];

interface CalculatorDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const CalculatorDropdown: React.FC<CalculatorDropdownProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full text-left font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 200);
        }}
        className="w-full flex items-center justify-between bg-gray-50 border border-transparent hover:border-gray-205 focus:bg-white focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 rounded-xl py-3 px-4 text-base font-bold text-gray-800 cursor-pointer transition-all outline-none"
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-[999] max-h-48 overflow-y-auto divide-y divide-gray-50 animate-fadeIn">
          {options.map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(num);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 ${
                value === num ? "bg-[#C5A059]/5 text-[#13503B]" : ""
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const WardrobeCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Wardrobe Configuration State
  const [selectedLength, setSelectedLength] = useState<string>("6");
  // const [customLength, setCustomLength] = useState<number>(6);
  const [selectedHeight, setSelectedHeight] = useState<string>("8");
  const [selectedType, setSelectedType] = useState<string>("Sliding Door");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("HDHMR");
  const [selectedFinish, setSelectedFinish] = useState<string>("Laminate");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    "Drawers",
    "LED Lighting",
  ]);

  // Smooth scroll to top on step change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Submitted Customer details
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { mutateAsync, isPending } = useQuote();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((acc) => acc !== id) : [...prev, id],
    );
  };

  const submitToBackend = async (customerDetails: CustomerDetails) => {
    const displayLength = selectedLength.includes("ft")
      ? selectedLength
      : `${selectedLength} ft`;
    const displayHeight =
      selectedHeight === "Ceiling Height"
        ? "Ceiling Height"
        : selectedHeight.includes("ft")
          ? selectedHeight
          : `${selectedHeight} ft`;
    const accessoriesText =
      selectedAccessories.length > 0 ? selectedAccessories.join(", ") : "None";
    const payload: QuoteRequest = {
      bhkType: `Wardrobe (${selectedType})`,
      areaSize: `${displayLength} x ${displayHeight} (Material: ${selectedMaterial}, Finish: ${selectedFinish}, Accessories: ${accessoriesText})`,
      rooms: { living: 0, kitchen: 0, bedroom: 1, bathroom: 0, dining: 0 },
      package: `${selectedMaterial} + ${selectedFinish} (Accessories: ${accessoriesText})`,
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      city: customerDetails.city,
      latitude: customerDetails.latitude,
      longitude: customerDetails.longitude,
      recaptchaToken: customerDetails.recaptchaToken,
    };

    setForm(customerDetails);

    try {
      const response = await mutateAsync(payload);
      setEstimatedPrice(response.estimatedPrice);
      setCurrentStep(7); // Results Step
    } catch (error) {
      console.error("Mutation failed", error);
      alert("Failed to calculate estimate. Please try again.");
    }
  };
  const steps = [
    "Wardrobe Type",
    "Wardrobe Dimensions",
    "Finish",
    "Material",
    "Accessories",
    "Summary",
    "Get Quote",
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-2 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col min-h-[600px]">
        {/* Progress Bar Header - Hide on Success/Loading */}
        {currentStep >= 0 && currentStep < 5 && (
          <div className="bg-white px-8 py-6 border-b border-gray-50 flex justify-between items-center relative">
            <div className="absolute top-[42px] left-10 right-10 h-0.5 bg-gray-100 -z-0"></div>
            <div className="w-full flex justify-between z-10">
              {steps.slice(0, 5).map((label, idx) => {
                const stepNum = idx;
                const isCompleted = currentStep > stepNum;
                const isActive = currentStep === stepNum;
                const isClickable = stepNum < currentStep;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(stepNum);
                      }
                    }}
                    disabled={!isClickable}
                    className={`flex flex-col items-center bg-white px-2 focus:outline-none transition-all duration-300 ${isClickable ? "cursor-pointer group" : "cursor-default"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#13503B] text-white group-hover:bg-[#13503B]/80 group-hover:scale-105"
                          : isActive
                            ? "bg-[#C5A059] text-white ring-4 ring-[#C5A059]/20"
                            : "bg-white border-2 border-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : stepNum + 1}
                    </div>
                    <span className="hidden md:block text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-wider">
                      {label.replace("Wardrobe ", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          {/* ================= STEP 1: WARDROBE TYPE ================= */}
          {currentStep === 0 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                Step 1 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">
                Choose your wardrobe type
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Select the style of wardrobe layout.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {TYPES.map((t) => (
                  <div key={t.id} className="flex flex-col text-left group">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedType(t.id);
                      }}
                      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 h-48 w-full cursor-pointer ${
                        selectedType === t.id
                          ? "border-[#C5A059] shadow-lg scale-[1.02]"
                          : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                      }`}
                    >
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
                      <span className="absolute bottom-3 left-4 z-20 text-base font-bold text-white tracking-wide">
                        {t.name}
                      </span>
                      {selectedType === t.id && (
                        <div className="absolute top-3 right-3 bg-[#C5A059] text-white rounded-full p-1.5 shadow-md z-20 animate-scaleIn">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed px-1">
                      {t.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 2: WARDROBE DIMENSIONS ================= */}
          {currentStep === 1 && (
            <div className="animate-fadeIn text-center flex flex-col items-center">
              <div className="text-center mb-8 w-full">
                <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                  Step 2 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-2">
                  Specify wardrobe dimensions
                </h2>
                <p className="text-gray-500 text-sm">
                  Select the length and height measurements for your wardrobe
                  cabinet layout.
                </p>
              </div>

              {/* Dropdowns Container */}
              <div className="w-full max-w-md space-y-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-4">
                {/* Length Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13503B] text-left mb-2 pl-1">
                    Wardrobe Length (Width)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CalculatorDropdown
                        value={selectedLength}
                        options={LENGTHS}
                        onChange={(val) => setSelectedLength(val)}
                      />
                    </div>
                    <span className="text-base font-bold text-gray-550 w-6 text-right">
                      ft
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] text-left mt-1.5 pl-1">
                    Outer length (horizontal width) of cabinet layout.
                  </p>
                </div>

                {/* Height Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13503B] text-left mb-2 pl-1">
                    Wardrobe Height
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CalculatorDropdown
                        value={selectedHeight}
                        options={HEIGHTS}
                        onChange={(val) => setSelectedHeight(val)}
                      />
                    </div>
                    <span className="text-base font-bold text-gray-550 w-6 text-right transition-all">
                      {selectedHeight === "Ceiling Height" ? "" : "ft"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] text-left mt-1.5 pl-1">
                    Height of your wardrobe cabinet layout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: FINISH ================= */}
          {currentStep === 2 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                Step 3 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">
                Choose your preferred finish
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Pick the face finish for the wardrobe doors and panels.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFinish(f.id);
                    }}
                    className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 min-h-[160px] sm:min-h-[240px] text-left group cursor-pointer ${
                      selectedFinish === f.id
                        ? "border-[#C5A059] shadow-lg scale-[1.02]"
                        : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    <img
                      src={f.image}
                      alt={f.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 transition-all duration-300 z-10 ${
                        selectedFinish === f.id
                          ? "bg-gradient-to-t from-[#13503B]/95 via-[#13503B]/60 to-[#13503B]/20"
                          : "bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 group-hover:via-black/55"
                      }`}
                    />

                    {selectedFinish === f.id && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#C5A059] text-white rounded-full p-1.5 shadow-md z-20 animate-scaleIn">
                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                      </div>
                    )}

                    <div className="relative z-20 p-2.5 sm:p-5 h-full flex flex-col justify-end min-h-[160px] sm:min-h-[240px] pointer-events-none">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-lg font-bold text-white tracking-wide">
                          {f.name}
                        </span>
                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest bg-[#C5A059] text-white px-1.5 py-0.5 rounded shadow-sm">
                          {f.tag}
                        </span>
                      </div>
                      <span className="block text-[9px] sm:text-xs text-gray-200 mt-0.5 sm:mt-2 line-clamp-2 leading-relaxed">
                        {f.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: MATERIAL ================= */}
          {currentStep === 3 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                Step 4 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">
                Choose the core material
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Choose the inner substrate panel material which guarantees
                robustness.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      setSelectedMaterial(mat.id);
                    }}
                    className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 min-h-[160px] sm:min-h-[240px] text-left group cursor-pointer ${
                      selectedMaterial === mat.id
                        ? "border-[#C5A059] shadow-lg scale-[1.02]"
                        : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 transition-all duration-300 z-10 ${
                        selectedMaterial === mat.id
                          ? "bg-gradient-to-t from-[#13503B]/95 via-[#13503B]/60 to-[#13503B]/20"
                          : "bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 group-hover:via-black/55"
                      }`}
                    />

                    {/* Badge */}
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-xs text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm">
                      {mat.badge}
                    </span>

                    {selectedMaterial === mat.id && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#C5A059] text-white rounded-full p-1.5 shadow-md z-20 animate-scaleIn">
                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                      </div>
                    )}

                    <div className="relative z-20 p-2.5 sm:p-5 h-full flex flex-col justify-end min-h-[160px] sm:min-h-[240px] pointer-events-none">
                      <span className="block text-xs sm:text-lg font-bold text-white tracking-wide">
                        {mat.name}
                      </span>
                      <span className="block text-[9px] sm:text-xs text-gray-200 mt-0.5 sm:mt-2 line-clamp-2 leading-relaxed">
                        {mat.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 5: ACCESSORIES ================= */}
          {currentStep === 4 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                Step 5 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">
                Select accessories
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Select multiple premium additions to elevate closet
                functionality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-[460px] overflow-y-auto pr-1">
                {ACCESSORIES.map((acc) => {
                  const isChecked = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.id)}
                      className={`relative rounded-xl border-2 transition-all duration-300 flex items-center text-left cursor-pointer overflow-hidden ${
                        isChecked
                          ? "border-[#C5A059] bg-[#C5A059]/5 shadow-md scale-[1.01]"
                          : "border-gray-100 bg-white hover:border-[#13503B] hover:shadow-md"
                      }`}
                    >
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 p-3 pr-8 min-w-0">
                        <span className="font-bold text-gray-800 text-sm block truncate">
                          {acc.name}
                        </span>
                        <p className="text-[11px] text-gray-400 mt-1 leading-tight line-clamp-2">
                          {acc.desc}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isChecked
                              ? "bg-[#C5A059] border-transparent text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && <CheckCircle2 size={12} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 7: SUMMARY SCREEN ================= */}
          {currentStep === 5 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                Summary
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">
                Configurator Summary
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Review your wardrobe selections below before getting an
                estimate.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4 text-left">
                {/* Length */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Wardrobe Length
                    </span>
                    <span className="text-sm font-bold text-gray-800 font-sans">
                      {selectedLength.includes("ft")
                        ? selectedLength
                        : `${selectedLength} ft`}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Height */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Wardrobe Height
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {selectedHeight === "Ceiling Height"
                        ? "Ceiling Height"
                        : selectedHeight.includes("ft")
                          ? selectedHeight
                          : `${selectedHeight} ft`}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Type */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Wardrobe Type
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {TYPES.find((t) => t.id === selectedType)?.name ||
                        selectedType}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Finish */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Finish
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {FINISHES.find((f) => f.id === selectedFinish)?.name ||
                        selectedFinish}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Material */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Material
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {MATERIALS.find((m) => m.id === selectedMaterial)?.name ||
                        selectedMaterial}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Accessories */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">
                      Accessories
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {selectedAccessories.length > 0
                        ? selectedAccessories
                            .map(
                              (id) =>
                                ACCESSORIES.find((a) => a.id === id)?.name ||
                                id,
                            )
                            .join(", ")
                        : "None Selected"}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-[#13503B] hover:text-[#0d3528] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 8: GET QUOTE (Map Geolocation) ================= */}
          {currentStep === 6 && (
            <Step6Quote onSubmit={submitToBackend} loading={isPending} />
          )}

          {/* ================= STEP 9: RESULTS PAGE ================= */}
          {currentStep === 7 && estimatedPrice !== null && (
            <div className="text-center animate-fadeIn py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 text-green-600 shadow-inner">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="text-2xl font-serif text-gray-500 mb-1">
                Your Wardrobe Estimate
              </h2>
              <div className="text-4xl sm:text-5xl font-black text-[#13503B] mb-8 tracking-tight">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(estimatedPrice)}
              </div>

              {/* What happens next details */}
              <div className="bg-[#13503B]/5 rounded-xl p-5 border border-[#13503B]/10 text-left mb-8">
                <h4 className="font-bold text-[#13503B] text-sm mb-1">
                  Estimate Sent to WhatsApp
                </h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Our designer will reach out to you within 24 hours at{" "}
                  <span className="font-semibold text-gray-700">
                    {form.phone}
                  </span>{" "}
                  to book a physical site layout verify session.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setEstimatedPrice(null);
                  }}
                  className="flex-1 bg-[#13503B] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#0d3528] active:scale-95 transition-all cursor-pointer"
                >
                  Modify Selection
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setEstimatedPrice(null);
                    setForm({ name: "", phone: "", email: "", city: "" });
                  }}
                  className="flex-1 bg-white text-[#13503B] border-2 border-gray-200 py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons (Hidden on results) */}
        {currentStep >= 0 && currentStep < 7 && (
          <div className="px-4 py-4 sm:px-8 sm:py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
            <button
              onClick={handleBack}
              className="group flex items-center gap-1.5 sm:gap-2 border border-gray-200 text-gray-500 hover:text-[#13503B] hover:border-[#13503B] px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full font-bold tracking-widest text-[10px] sm:text-xs transition-all hover:bg-gray-50/50 active:scale-95 cursor-pointer shadow-sm bg-white"
            >
              <ArrowLeft
                size={12}
                className="transition-transform group-hover:-translate-x-0.5 sm:w-3.5 sm:h-3.5"
              />
              GO BACK
            </button>

            {currentStep >= 0 && currentStep <= 5 && (
              <button
                onClick={handleNext}
                className="group flex items-center gap-1.5 sm:gap-2 bg-[#13503B] text-white px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-bold tracking-widest text-[10px] sm:text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20 active:scale-95 cursor-pointer"
              >
                CONTINUE
                <ChevronRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5 sm:w-3.5 sm:h-3.5"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Step6Quote = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: CustomerDetails) => void;
  loading: boolean;
}) => {
  return (
    <QuoteContactStep
      onSubmit={onSubmit}
      loading={loading}
      headingText="Almost ready!"
      descriptionText="Enter your details to reveal your personalized wardrobe estimate."
    />
  );
};

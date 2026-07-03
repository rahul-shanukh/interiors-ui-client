import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, ArrowLeft, Calculator, Sparkles, User, Phone, Mail, MapPin, Search, ChevronDown, Loader2, X, Star, Settings, Shield, Award, Edit2 } from "lucide-react";
import { COUNTRY_CODES } from "./countryCodes";
import { useQuote } from "./useQuote";
import type { QuoteRequest, CustomerDetails } from "./types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configurable Options
const LENGTHS = ["4 ft", "5 ft", "6 ft", "7 ft", "8 ft", "Custom"];

const TYPES = [
  { id: "Swing Door", name: "Swing Door", desc: "Classic hinged doors offering complete access to the cabinet.", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop" },
  { id: "Sliding Door", name: "Sliding Door", desc: "Sleek sliding mechanism, space-saving for modern bedrooms.", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=600&auto=format&fit=crop" },
  { id: "Walk-in Wardrobe", name: "Walk-in Wardrobe", desc: "Open-plan luxury dressing space with partition layouts.", image: "https://images.unsplash.com/photo-1558882224-cca166733360?q=80&w=600&auto=format&fit=crop" }
];

const FINISHES = [
  { id: "Laminate", name: "Laminate", desc: "Matte or glossy protective overlays, scratch-resistant, daily-use robust.", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop" },
  { id: "Acrylic", name: "Acrylic", desc: "Mirror-like ultra-glossy finish, stain-resistant premium visuals.", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600&auto=format&fit=crop" },
  { id: "Glass", name: "Glass", desc: "Tinted transparent or reflective backing, high-end reflection aesthetic.", image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600&auto=format&fit=crop" },
  { id: "PU Finish", name: "PU Finish", desc: "Premium seamless spray paint finish, customizable colors, luxurious silk feel.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop" },
  { id: "Veneer", name: "Veneer", desc: "Natural wood sheet overlay, polished for an authentic, warm premium look.", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop" }
];

const MATERIALS = [
  { id: "Plywood", name: "Plywood", desc: "High tensile strength, water-resistant core, extremely durable.", badge: "Excellent Durability", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop" },
  { id: "HDHMR", name: "HDHMR", desc: "High Density High Moisture Resistant, superior termite and water resistance.", badge: "Highest Durability", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop" },
  { id: "MDF", name: "MDF", desc: "Medium Density Fiberboard, ultra-smooth surface, ideal for clean finishes.", badge: "Moderate Durability", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop" },
  { id: "Particle Board", name: "Particle Board", desc: "Eco-friendly, lightweight wood panels, best for light usage.", badge: "Standard Durability", image: "https://images.unsplash.com/photo-1507398941214-572c25f4b1bc?q=80&w=600&auto=format&fit=crop" }
];

const ACCESSORIES = [
  { id: "Drawers", name: "Drawers", desc: "Convenient pull-out drawers for folded clothing." },
  { id: "Shoe Rack", name: "Shoe Rack", desc: "Dedicated shelving to keep your footwear organized." },
  { id: "Jewellery Organizer", name: "Jewellery Organizer", desc: "Velvet-lined compartment for accessories." },
  { id: "Mirror", name: "Mirror", desc: "Integrated full-length mirror for styling." },
  { id: "LED Lighting", name: "LED Lighting", desc: "Warm sensored lighting inside the wardrobe." },
  { id: "Soft Close Hinges", name: "Soft Close Hinges", desc: "Hinges that prevent slamming and close silently." },
  { id: "Tie Holder", name: "Tie Holder", desc: "Dedicated slide-out holder for ties and belts." },
  { id: "Trouser Pull-Out", name: "Trouser Pull-Out", desc: "Crease-free multi-tier trouser hanging rack." },
  { id: "Loft Storage", name: "Loft Storage", desc: "Top-level cabinets for suitcases and seasonal items." },
  { id: "Hanging Rod", name: "Hanging Rod", desc: "Sturdy rod for hanging shirts, coats, and dresses." }
];

// Fallback Cost Calculator
const calculateFallbackPrice = (selections: {
  length: string;
  customLength?: number;
  height: string;
  type: string;
  material: string;
  finish: string;
  accessories: string[];
}) => {
  let lengthFt = 6;
  if (selections.length === "Custom" && selections.customLength) {
    lengthFt = selections.customLength;
  } else {
    lengthFt = parseInt(selections.length) || 6;
  }

  let baseRatePerSqFt = 1200; // default Swing
  if (selections.type === "Sliding Door") baseRatePerSqFt = 1500;
  if (selections.type === "Walk-in Wardrobe") baseRatePerSqFt = 1800;

  let heightFt = 8;
  if (selections.height === "7 ft") heightFt = 7;
  if (selections.height === "8 ft") heightFt = 8;
  if (selections.height === "9 ft") heightFt = 9;
  if (selections.height === "Ceiling Height") heightFt = 10;

  const sqFt = lengthFt * heightFt;

  const MATERIAL_RATES: Record<string, number> = {
    "Plywood": 200,
    "HDHMR": 300,
    "MDF": 100,
    "Particle Board": 0
  };
  const matRate = MATERIAL_RATES[selections.material] || 0;

  const FINISH_RATES: Record<string, number> = {
    "Laminate": 0,
    "Acrylic": 150,
    "Glass": 250,
    "PU Finish": 350,
    "Veneer": 400
  };
  const finRate = FINISH_RATES[selections.finish] || 0;

  const basePrice = sqFt * baseRatePerSqFt;
  const matSurcharge = sqFt * matRate;
  const finSurcharge = sqFt * finRate;

  const ACCESSORY_PRICES: Record<string, number> = {
    "Drawers": 2500,
    "Shoe Rack": 2000,
    "Jewellery Organizer": 3000,
    "Mirror": 1500,
    "LED Lighting": 2500,
    "Soft Close Hinges": 3000,
    "Tie Holder": 1200,
    "Trouser Pull-Out": 2200,
    "Loft Storage": 8000,
    "Hanging Rod": 1000
  };

  const accPrice = selections.accessories.reduce((sum, item) => sum + (ACCESSORY_PRICES[item] || 0), 0);

  return {
    base: basePrice,
    material: matSurcharge,
    finish: finSurcharge,
    accessories: accPrice,
    total: basePrice + matSurcharge + finSurcharge + accPrice,
  };
};

export const WardrobeCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Wardrobe Configuration State
  const [selectedLength, setSelectedLength] = useState<string>("6 ft");
  const [customLength, setCustomLength] = useState<number>(6);
  const [selectedHeight, setSelectedHeight] = useState<string>("8 ft");
  const [selectedType, setSelectedType] = useState<string>("Sliding Door");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("HDHMR");
  const [selectedFinish, setSelectedFinish] = useState<string>("Laminate");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(["Drawers", "LED Lighting"]);

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
  const [priceBreakdown, setPriceBreakdown] = useState<{
    base: number;
    material: number;
    finish: number;
    accessories: number;
  } | null>(null);

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
      prev.includes(id) ? prev.filter((acc) => acc !== id) : [...prev, id]
    );
  };

  const submitToBackend = async (customerDetails: CustomerDetails) => {
    const displayLength = selectedLength === "Custom" ? `${customLength} ft` : selectedLength;
    const payload: QuoteRequest = {
      bhkType: `Wardrobe (${selectedType})`,
      areaSize: `${displayLength} x ${selectedHeight} (Material: ${selectedMaterial}, Finish: ${selectedFinish})`,
      rooms: { living: 0, kitchen: 0, bedroom: 1, bathroom: 0, dining: 0 },
      package: `${selectedMaterial} + ${selectedFinish}`,
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      city: customerDetails.city,
      latitude: customerDetails.latitude,
      longitude: customerDetails.longitude,
    };

    setForm(customerDetails);

    try {
      const response = await mutateAsync(payload);
      setEstimatedPrice(response.estimatedPrice);

      // Distribute visual breakdown based on our formulas (Vite API expects just total estimate)
      const localBreakdown = calculateFallbackPrice({
        length: selectedLength,
        customLength,
        height: selectedHeight,
        type: selectedType,
        material: selectedMaterial,
        finish: selectedFinish,
        accessories: selectedAccessories,
      });

      // Scale breakdown parts to align with backend total if they differ slightly
      const scalingFactor = response.estimatedPrice / localBreakdown.total;
      setPriceBreakdown({
        base: Math.round(localBreakdown.base * scalingFactor),
        material: Math.round(localBreakdown.material * scalingFactor),
        finish: Math.round(localBreakdown.finish * scalingFactor),
        accessories: Math.round(localBreakdown.accessories * scalingFactor),
      });

      setCurrentStep(9); // Results Step
    } catch (error) {
      console.error("Mutation failed, calculating client-side fallback", error);
      const localBreakdown = calculateFallbackPrice({
        length: selectedLength,
        customLength,
        height: selectedHeight,
        type: selectedType,
        material: selectedMaterial,
        finish: selectedFinish,
        accessories: selectedAccessories,
      });
      setEstimatedPrice(localBreakdown.total);
      setPriceBreakdown({
        base: localBreakdown.base,
        material: localBreakdown.material,
        finish: localBreakdown.finish,
        accessories: localBreakdown.accessories,
      });
      setCurrentStep(9); // Results Step
    }
  };

  const steps = [
    "Intro",
    "Wardrobe Length",
    "Wardrobe Height",
    "Wardrobe Type",
    "Finish",
    "Material",
    "Accessories",
    "Summary",
    "Get Quote"
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-2 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col min-h-[600px]">

        {/* Progress Bar Header - Hide on Success/Loading */}
        {currentStep > 0 && currentStep < 7 && (
          <div className="bg-white px-8 py-6 border-b border-gray-50 flex justify-between items-center relative">
            <div className="absolute top-[42px] left-10 right-10 h-0.5 bg-gray-100 -z-0"></div>
            <div className="w-full flex justify-between z-10">
              {steps.slice(1, 7).map((label, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep > stepNum;
                const isActive = currentStep === stepNum;
                return (
                  <div key={label} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#13503B] text-white"
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">

          {/* ================= STEP 0: LANDING PAGE ================= */}
          {currentStep === 0 && (
            <div className="text-center animate-fadeIn py-4">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop"
                  alt="Luxury Wardrobe Design"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13503B]/90 via-[#13503B]/40 to-transparent flex flex-col justify-end p-8 text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest rounded-full w-max mb-3">
                    <Sparkles size={10} /> Configurator v2
                  </span>
                  <h1 className="text-white text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-2">
                    Estimate Your Dream Wardrobe Cost
                  </h1>
                  <p className="text-gray-200 text-sm max-w-lg font-light leading-relaxed">
                    Choose doors, materials, premium laminate/glass finishes, and accessories to customize and receive an instant estimate.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto bg-[#13503B] text-white px-10 py-5 rounded-full font-bold tracking-widest text-xs uppercase shadow-xl hover:bg-[#0d3528] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Start Configurator
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-400 font-bold tracking-widest text-xs uppercase hover:text-gray-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 1: WARDROBE LENGTH ================= */}
          {currentStep === 1 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 2 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">What is your wardrobe length?</h2>
              <p className="text-gray-400 text-sm mb-8">Select the outer length (horizontal width) of your cabinet layout.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {LENGTHS.map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      setSelectedLength(len);
                    }}
                    className={`py-6 px-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                      selectedLength === len
                        ? "border-[#13503B] bg-[#13503B]/5 text-[#13503B] scale-105 shadow-md font-bold"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span className="text-xl font-bold font-serif">{len}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">Width</span>
                  </button>
                ))}
              </div>

              {selectedLength === "Custom" && (
                <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 animate-fadeIn">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13503B] mb-3">
                    Specify Custom Length: {customLength} ft
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={customLength}
                    onChange={(e) => setCustomLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#13503B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
                    <span>3 FT</span>
                    <span>15 FT</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: WARDROBE HEIGHT ================= */}
          {currentStep === 2 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 3 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">What is your wardrobe height?</h2>
              <p className="text-gray-400 text-sm mb-8">Select the height of your wardrobe cabinet layout.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {["7 ft", "8 ft", "9 ft", "Ceiling Height"].map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setSelectedHeight(h);
                    }}
                    className={`py-6 px-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                      selectedHeight === h
                        ? "border-[#13503B] bg-[#13503B]/5 text-[#13503B] scale-105 shadow-md font-bold"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span className="text-base font-bold font-serif">{h}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">Height</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 3: WARDROBE TYPE ================= */}
          {currentStep === 3 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 4 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">Choose your wardrobe type</h2>
              <p className="text-gray-400 text-sm mb-8">Select the style of wardrobe layout.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedType(t.id);
                    }}
                    className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 min-h-[200px] text-left group cursor-pointer ${
                      selectedType === t.id
                        ? "border-[#C5A059] shadow-lg scale-[1.02]"
                        : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 transition-all duration-300 z-10 ${
                      selectedType === t.id
                        ? "bg-gradient-to-t from-[#13503B]/95 via-[#13503B]/60 to-[#13503B]/20"
                        : "bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 group-hover:via-black/55"
                    }`} />

                    {selectedType === t.id && (
                      <div className="absolute top-3 right-3 bg-[#C5A059] text-white rounded-full p-1 shadow-md z-20 animate-scaleIn">
                        <CheckCircle2 size={14} />
                      </div>
                    )}

                    <div className="relative z-20 p-4 h-full flex flex-col justify-end min-h-[200px] pointer-events-none">
                      <span className="block text-base font-bold text-white tracking-wide">{t.name}</span>
                      <span className="block text-[11px] text-gray-200 mt-1 line-clamp-2 leading-tight">
                        {t.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: FINISH ================= */}
          {currentStep === 4 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 5 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">Choose your preferred finish</h2>
              <p className="text-gray-400 text-sm mb-8">Pick the face finish for the wardrobe doors and panels.</p>

              <div className="space-y-3 mb-8">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFinish(f.id);
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center text-left cursor-pointer overflow-hidden ${
                      selectedFinish === f.id
                        ? "border-[#13503B] bg-[#13503B]/5 scale-[1.01] shadow-md"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-14 h-14 rounded-lg object-cover mr-4 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-gray-800 block text-sm sm:text-base">{f.name}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 5: MATERIAL ================= */}
          {currentStep === 5 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 6 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">Choose the core material</h2>
              <p className="text-gray-400 text-sm mb-8">Choose the inner substrate panel material which guarantees robustness.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      setSelectedMaterial(mat.id);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex gap-4 cursor-pointer ${
                      selectedMaterial === mat.id
                        ? "border-[#13503B] bg-[#13503B]/5 scale-105 shadow-md"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="font-bold text-gray-800 text-sm truncate">{mat.name}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-tight mb-2">{mat.desc}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-gray-200/50 text-gray-600 px-2 py-0.5 rounded w-max">
                        {mat.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 6: ACCESSORIES ================= */}
          {currentStep === 6 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Step 7 of 7</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">Select accessories</h2>
              <p className="text-gray-400 text-sm mb-8">Select multiple premium additions to elevate closet functionality.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-[360px] overflow-y-auto pr-1">
                {ACCESSORIES.map((acc) => {
                  const isChecked = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
                        isChecked
                          ? "border-[#13503B] bg-[#13503B]/5 shadow-sm"
                          : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="pr-3">
                        <span className="font-bold text-gray-800 text-sm block">{acc.name}</span>
                        <p className="text-[11px] text-gray-400 mt-1">{acc.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#13503B] border-transparent text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-[#13503B] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0d3528]"
              >
                Proceed to Summary
              </button>
            </div>
          )}

          {/* ================= STEP 7: SUMMARY SCREEN ================= */}
          {currentStep === 7 && (
            <div className="animate-fadeIn text-center">
              <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest">Summary</span>
              <h2 className="text-3xl font-serif text-[#13503B] font-bold mt-2 mb-4">Configurator Summary</h2>
              <p className="text-gray-400 text-sm mb-8">Review your wardrobe selections below before getting an estimate.</p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4 text-left">
                {/* Length */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Wardrobe Length</span>
                    <span className="text-sm font-bold text-gray-800 font-sans">
                      {selectedLength === "Custom" ? `${customLength} ft` : selectedLength}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Height */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Wardrobe Height</span>
                    <span className="text-sm font-bold text-gray-800">{selectedHeight}</span>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Type */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Wardrobe Type</span>
                    <span className="text-sm font-bold text-gray-800">
                      {TYPES.find((t) => t.id === selectedType)?.name || selectedType}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Finish */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Finish</span>
                    <span className="text-sm font-bold text-gray-800">
                      {FINISHES.find((f) => f.id === selectedFinish)?.name || selectedFinish}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Material */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Material</span>
                    <span className="text-sm font-bold text-gray-800">
                      {MATERIALS.find((m) => m.id === selectedMaterial)?.name || selectedMaterial}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(5)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Accessories */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider block">Accessories</span>
                    <span className="text-sm font-bold text-gray-800">
                      {selectedAccessories.length > 0
                        ? selectedAccessories.map((id) => ACCESSORIES.find((a) => a.id === id)?.name || id).join(", ")
                        : "None Selected"}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(6)} className="text-[#13503B] hover:text-[#0d3528] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-[#13503B] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0d3528] shadow-lg shadow-[#13503B]/20 active:scale-95 transition-all"
              >
                Reveal Cost Estimate
              </button>
            </div>
          )}

          {/* ================= STEP 8: GET QUOTE (Map Geolocation) ================= */}
          {currentStep === 8 && (
            <Step3Quote onSubmit={submitToBackend} loading={isPending} />
          )}

          {/* ================= STEP 9: RESULTS PAGE ================= */}
          {currentStep === 9 && estimatedPrice !== null && priceBreakdown !== null && (
            <div className="text-center animate-fadeIn py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 text-green-600 shadow-inner">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="text-2xl font-serif text-gray-500 mb-1">Your Wardrobe Estimate</h2>
              <div className="text-4xl sm:text-5xl font-black text-[#13503B] mb-8 tracking-tight">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(estimatedPrice)}
              </div>

              {/* Breakdown Grid */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left divide-y divide-gray-200/50">
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-semibold">Base (Size/Type)</span>
                  <span className="font-bold text-gray-800">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(priceBreakdown.base)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-semibold">Material Surcharge</span>
                  <span className="font-bold text-gray-800">
                    +{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(priceBreakdown.material)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-semibold">Finish Surcharge</span>
                  <span className="font-bold text-gray-800">
                    +{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(priceBreakdown.finish)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-semibold">Accessories Surcharge</span>
                  <span className="font-bold text-gray-800">
                    +{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(priceBreakdown.accessories)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-sm font-black text-[#13503B]">
                  <span>ESTIMATED INVESTMENT</span>
                  <span>
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(estimatedPrice)}
                  </span>
                </div>
              </div>

              {/* What happens next details */}
              <div className="bg-[#13503B]/5 rounded-xl p-5 border border-[#13503B]/10 text-left mb-8">
                <h4 className="font-bold text-[#13503B] text-sm mb-1">Estimate Sent to WhatsApp</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Our designer will reach out to you within 24 hours at <span className="font-semibold text-gray-700">{form.phone}</span> to book a physical site layout verify session.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setEstimatedPrice(null);
                    setPriceBreakdown(null);
                  }}
                  className="flex-1 bg-[#13503B] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#0d3528] active:scale-95 transition-all cursor-pointer"
                >
                  Modify Selection
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setEstimatedPrice(null);
                    setPriceBreakdown(null);
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

        {/* Footer Navigation Buttons (Hidden on Intro and results) */}
        {currentStep > 0 && currentStep < 9 && (
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-[#13503B] hover:border-[#13503B] px-6 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-gray-50/50 active:scale-95 cursor-pointer shadow-sm bg-white"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              GO BACK
            </button>

            {currentStep < 7 && (
              <button
                onClick={handleNext}
                className="group flex items-center gap-2 bg-[#13503B] text-white px-8 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20 active:scale-95 cursor-pointer"
              >
                CONTINUE
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const CITIES = [
  { name: "Bengaluru", coords: [12.9716, 77.5946] as [number, number] },
  { name: "Mumbai", coords: [19.0760, 72.8777] as [number, number] },
  { name: "Delhi NCR", coords: [28.6139, 77.2090] as [number, number] },
  { name: "Hyderabad", coords: [17.3850, 78.4867] as [number, number] },
  { name: "Pune", coords: [18.5204, 73.8567] as [number, number] },
  { name: "Chennai", coords: [13.0827, 80.2707] as [number, number] },
  { name: "Kolkata", coords: [22.5726, 88.3639] as [number, number] },
];

const Step3Quote = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: CustomerDetails) => void;
  loading: boolean;
}) => {
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const isPopularCityMatch = CITIES.some(
    (c) => c.name.toLowerCase() === debouncedSearchQuery.toLowerCase().trim()
  );

  const isDebouncing = searchQuery !== debouncedSearchQuery;

  const { data: suggestions = [], isFetching: isSearching } = useQuery<{
    displayName: string;
    shortName: string;
    coords: [number, number];
  }[]>({
    queryKey: ["citySuggestions", debouncedSearchQuery],
    queryFn: async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          debouncedSearchQuery
        )}&format=json&countrycodes=in&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      return data.map((item: any) => {
        const parts = item.display_name.split(",");
        const shortName = parts.slice(0, 2).map((p: any) => p.trim()).join(", ");
        return {
          displayName: item.display_name,
          shortName: shortName,
          coords: [parseFloat(item.lat), parseFloat(item.lon)] as [number, number],
        };
      });
    },
    enabled: debouncedSearchQuery.trim().length >= 3 && !isPopularCityMatch,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: reverseGeocode } = useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`
      );
      if (!res.ok) throw new Error("Reverse geocoding failed");
      return res.json();
    },
    onSuccess: (data, variables) => {
      if (data && data.address) {
        const address = data.address;
        const district = address.city || address.town || address.district || address.county || "";
        const state = address.state || "";

        let name = "";
        if (district && state) {
          name = `${district}, ${state}`;
        } else {
          name = district || state || "Selected Location";
        }

        selectCityRef.current(name, [variables.lat, variables.lng]);
      }
    },
    onError: (err) => {
      console.error("Error reverse geocoding clicked location:", err);
    }
  });

  const reverseGeocodeRef = useRef(reverseGeocode);
  reverseGeocodeRef.current = reverseGeocode;

  const leafletMapRef = useRef<L.Map | null>(null);
  const markerMapRef = useRef<Record<string, L.Marker>>({});
  const customMarkerRef = useRef<L.Marker | null>(null);

  function handleSelectCity(name: string, coords: [number, number]) {
    setForm((prev) => ({
      ...prev,
      city: name,
      latitude: coords[0],
      longitude: coords[1],
    }));
    setSearchQuery(name);

    if (leafletMapRef.current) {
      leafletMapRef.current.setView(coords, 8, { animate: true });

      const predefinedMarker = markerMapRef.current[name];
      if (predefinedMarker) {
        if (customMarkerRef.current) {
          customMarkerRef.current.remove();
          customMarkerRef.current = null;
        }
        setTimeout(() => {
          predefinedMarker.openPopup();
        }, 300);
      } else {
        if (customMarkerRef.current) {
          customMarkerRef.current.remove();
        }

        const customIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border-2 border-[#13503B] transition-transform duration-300 hover:scale-110">
              <div class="w-2 h-2 rounded-full bg-[#C5A059]"></div>
            </div>
          `,
          className: "custom-leaflet-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon: customIcon })
          .addTo(leafletMapRef.current)
          .bindPopup(`<div class="text-[#13503B] font-bold text-center">${name}</div>`, {
            closeButton: false,
            offset: [0, -5],
          });

        customMarkerRef.current = marker;
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    }
  }

  const selectCityRef = useRef<(name: string, coords: [number, number]) => void>(() => { });
  selectCityRef.current = handleSelectCity;

  const initMap = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      return;
    }

    if (leafletMapRef.current) return;

    const map = L.map(node, {
      zoomControl: true,
      attributionControl: true,
    }).setView([20.5937, 78.9629], 4);
    leafletMapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    }).addTo(map);

    const customIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border-2 border-[#13503B] transition-transform duration-300 hover:scale-110">
          <div class="w-2 h-2 rounded-full bg-[#C5A059]"></div>
        </div>
      `,
      className: "custom-leaflet-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const markerMap: Record<string, L.Marker> = {};
    CITIES.forEach((city) => {
      const marker = L.marker(city.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`<div class="text-[#13503B] font-bold text-center">${city.name}</div>`, {
          closeButton: false,
          offset: [0, -5],
        });
      marker.on("click", () => selectCityRef.current(city.name, city.coords));
      markerMap[city.name] = marker;
    });
    markerMapRef.current = markerMap;

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      reverseGeocodeRef.current({ lat, lng });
    });
  }, []);

  function handleSearch(query: string) {
    setSearchQuery(query);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="relative mb-10">
          <Loader2 size={80} className="text-[#13503B] animate-spin opacity-20" />
          <Calculator size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#13503B] animate-pulse" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#13503B] mb-3">Calculating Estimate...</h2>
        <p className="text-gray-400 text-sm italic">Analyzing layouts, dimensions, materials, and accessories specifications.</p>
      </div>
    );
  }

  return (
    <div className="text-center animate-fadeIn max-w-sm mx-auto w-full">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5A059]/10 rounded-full mb-6 text-[#C5A059]">
        <Sparkles size={32} />
      </div>
      <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-3">
        Almost ready!
      </h2>
      <p className="text-gray-500 text-sm mb-10">Enter your details to reveal your personalized wardrobe estimate.</p>

      <div className="space-y-3">
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium text-gray-800"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="relative flex items-center group">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors z-20" />

          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center z-20 border-r border-gray-200 group-focus-within:border-[#C5A059]/30 pr-2.5 transition-colors">
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              onBlur={() => {
                setTimeout(() => setShowCountryDropdown(false), 200);
              }}
              className="flex items-center gap-1 bg-transparent border-none outline-none font-semibold text-gray-700 text-sm cursor-pointer select-none py-1 hover:text-[#13503B] transition-colors pr-1"
            >
              <span>{countryCode}</span>
              <ChevronDown size={12} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>

          <input
            type="tel"
            placeholder="WhatsApp Number"
            className="w-full pl-24 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium text-gray-800 focus:shadow-md"
            value={form.phone}
            onChange={(e) => {
              const clean = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: clean });
            }}
          />

          {showCountryDropdown && (
            <div className="absolute top-[110%] left-0 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-50 max-h-60 overflow-y-auto animate-fadeIn">
              {COUNTRY_CODES.map((c) => (
                <button
                  key={`${c.code}-${c.iso}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCountryCode(c.code);
                    setShowCountryDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left font-semibold text-xs text-gray-700 ${countryCode === c.code ? "bg-[#C5A059]/5 text-[#13503B]" : ""
                    }`}
                >
                  <span className="truncate max-w-[70%]">{c.name} ({c.iso})</span>
                  <span className="text-[#C5A059] font-black">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address (Optional)"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium text-gray-800"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* City Selection */}
        <div className="text-left mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#13503B] mb-2 flex items-center gap-2">
            <MapPin size={14} /> Select City
          </label>
        </div>

        {/* Search City Input */}
        <div className="relative mb-2 z-30">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, Pune...)"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium text-gray-800"
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />

          {/* Suggestion Dropdown */}
          {showSuggestions && searchQuery.trim().length >= 3 && (
            <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {(isSearching || isDebouncing) ? (
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-500 justify-center">
                  <Loader2 size={16} className="animate-spin text-[#13503B]" />
                  <span>Searching locations...</span>
                </div>
              ) : (
                <>
                  {suggestions.map((c) => (
                    <div
                      key={c.displayName}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col text-left pr-2 max-w-[70%]">
                        <span className="font-semibold text-sm text-gray-800 truncate">{c.shortName}</span>
                        <span className="text-[10px] text-gray-400 truncate">{c.displayName}</span>
                      </div>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectCity(c.shortName, c.coords);
                          setShowSuggestions(false);
                        }}
                        className="bg-[#13503B] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0d3528] transition-colors cursor-pointer flex-shrink-0"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="px-4 py-4 text-sm text-gray-400 italic text-left">
                      No matching states or districts found
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Select Badges */}
        <div className="flex flex-wrap gap-2 justify-start mb-2">
          {CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleSelectCity(c.name, c.coords)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${form.city === c.name
                ? "bg-[#13503B] text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 mb-6">
          <div ref={initMap} className="leaflet-map-node w-full h-full z-10" />
        </div>

        <button
          onClick={() => onSubmit({
            ...form,
            phone: `${countryCode}${form.phone}`
          })}
          disabled={!form.name || !form.phone || !form.city}
          className="w-full mt-6 bg-[#13503B] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-30 shadow-2xl shadow-[#13503B]/20 transition-all active:scale-95 cursor-pointer hover:bg-[#0d3528]"
        >
          Reveal My Estimate
        </button>
        <p className="text-[10px] text-gray-400 mt-6">By clicking, you agree to receive a copy of your quote on WhatsApp.</p>
      </div>
    </div>
  );
};

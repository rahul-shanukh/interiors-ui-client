import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, ArrowLeft, Calculator, Sparkles, User, Phone, Mail, MapPin, Search, ChevronDown, Loader2, X } from "lucide-react";
import { COUNTRY_CODES } from "./countryCodes";
import { useQuote } from "./useQuote";
import type { QuoteRequest, CustomerDetails } from "./types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import lShapedImg from "../../assets/Lshaped.png";
import straightImg from "../../assets/straight.png";
import uShapedImg from "../../assets/ushaped.png";
import parallelImg from "../../assets/parallel.png";

import essentialImg from "../../assets/kessential.png";
import premiumImg from "../../assets/kpremium.png";
import luxeImg from "../../assets/kluxury.png";

// Mock layout data with illustrative details and descriptive graphics.
const kitchenLayouts = [
  {
    id: "l-shaped",
    name: "L-shaped",
    description: "Corner-optimized for a logical, efficient work triangle.",
    graphic: lShapedImg,
  },
  {
    id: "straight",
    name: "Straight",
    description: "Compact and simple, perfect for single-wall spaces.",
    graphic: straightImg,
  },
  {
    id: "u-shaped",
    name: "U-shaped",
    description: "Maximized counter space and a versatile cooking zone.",
    graphic: uShapedImg,
  },
  {
    id: "parallel",
    name: "Parallel",
    description: "Two parallel countertops and work zones facing each other.",
    graphic: parallelImg,
  },
];

const PACKAGES = [
  {
    id: "essential",
    name: "Essential",
    tag: "Budget Friendly",
    description: "Sturdy and durable finishes using quality laminate and standard hardware.",
    graphic: essentialImg,
  },
  {
    id: "premium",
    name: "Premium",
    tag: "Most Popular",
    description: "High-gloss acrylic finishes, premium wire accessories, and branded hardware.",
    graphic: premiumImg,
  },
  {
    id: "luxe",
    name: "Luxury",
    tag: "Signature Luxury",
    description: "Imported PU finishes, custom hardware, and elite luxury styling.",
    graphic: luxeImg,
  },
];

interface MeasurementDropdownProps {
  value: number;
  onChange: (val: number) => void;
}

const MeasurementDropdown: React.FC<MeasurementDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch options using TanStack Query to keep state management clean and avoid local useEffect fetching
  const { data: options = [] } = useQuery<number[]>({
    queryKey: ["measurementOptions"],
    queryFn: () => Array.from({ length: 19 }, (_, i) => i + 2),
    staleTime: Infinity,
  });

  return (
    <div className="relative w-full animate-fadeIn">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 200);
        }}
        className="w-full flex items-center justify-between bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 rounded-xl py-3 px-4 text-base font-bold text-gray-800 cursor-pointer transition-all outline-none"
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-[999] max-h-48 overflow-y-auto divide-y divide-gray-50 animate-fadeIn">
          {options.map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => {
                // Prevent button blur event from firing before mouse down is processed
                e.preventDefault();
                onChange(num);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 ${value === num ? "bg-[#C5A059]/5 text-[#13503B]" : ""
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


export const KitchenCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("premium");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { mutateAsync, isPending } = useQuote();

  // Keep measurements state for each layout separately so toggling doesn't clear customized values
  const [measurementsByLayout, setMeasurementsByLayout] = useState<Record<string, Record<string, number>>>({
    "l-shaped": { A: 3, B: 8 },
    "straight": { A: 8 },
    "u-shaped": { A: 8, B: 10, C: 8 },
    "parallel": { A: 8, B: 8 },
  });

  // Customer Form State
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
  });

  const handleSelectLayout = (id: string) => {
    setSelectedLayoutId(id);
    setCurrentStep(1);
    setMaxStep((prev) => Math.max(prev, 1));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedLayoutId) return;
    setCurrentStep((prev) => {
      const next = prev + 1;
      setMaxStep((m) => Math.max(m, next));
      return next;
    });
  };

  const submitToBackend = async (customerDetails: CustomerDetails) => {
    if (!selectedLayoutId) return;
    const measures = measurementsByLayout[selectedLayoutId];
    const totalLength = Object.values(measures).reduce((sum, val) => sum + val, 0);
    const selectedPkg = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[1];

    const measurementsString = Object.entries(measures)
      .map(([key, val]) => `${key}: ${val}ft`)
      .join(", ") + ` (Total: ${totalLength}ft)`;

    const payload: QuoteRequest = {
      bhkType: `Kitchen (${kitchenLayouts.find((l) => l.id === selectedLayoutId)?.name || "Custom"})`,
      areaSize: measurementsString,
      rooms: { living: 0, kitchen: 1, bedroom: 0, bathroom: 0, dining: 0 },
      package: selectedPkg.name,
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
      setCurrentStep(4);
    } catch (error) {
      console.error("Mutation failed, using client-side fallback price", error);
      let pricePerFoot = 2200; // Fallback default
      if (selectedPackageId === "essential") pricePerFoot = 1500;
      else if (selectedPackageId === "luxe") pricePerFoot = 3500;

      let multiplier = 1.0;
      if (selectedLayoutId === "l-shaped") multiplier = 1.1;
      else if (selectedLayoutId === "u-shaped") multiplier = 1.25;
      else if (selectedLayoutId === "parallel") multiplier = 1.15;

      const clientPrice = Math.round(totalLength * pricePerFoot * multiplier);
      setEstimatedPrice(clientPrice);
      setCurrentStep(4);
    }
  };

  const steps = ["Kitchen Layout", "Measurements", "Package", "Get Quote"];


  return (
    <div className="min-h-screen bg-[#fcfbf9] py-2 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col">

        {/* Progress Bar Header - Hide on Success/Loading */}
        {currentStep < 4 && !isPending && (
          <div className="bg-white px-8 py-8 border-b border-gray-50 flex justify-between items-center relative">
            <div className="absolute top-[50px] left-10 right-10 h-0.5 bg-gray-100 -z-0"></div>
            <div
              className="absolute top-[50px] left-10 right-10 h-0.5 bg-[#13503B] transition-transform duration-700 origin-left -z-0"
              style={{ transform: `scaleX(${currentStep / 3})` }}
            ></div>

            {steps.map((label, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = index <= maxStep;
              return (
                <button
                  key={label}
                  onClick={() => {
                    if (isClickable) {
                      setCurrentStep(index);
                    }
                  }}
                  disabled={!isClickable}
                  className={`flex flex-col items-center z-10 bg-white px-2 focus:outline-none transition-all duration-300 ${isClickable ? "cursor-pointer group" : "cursor-default"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${isCompleted
                      ? "bg-[#13503B] text-white group-hover:bg-[#13503B]/80 group-hover:scale-105"
                      : isActive
                        ? "bg-[#C5A059] text-white ring-8 ring-[#C5A059]/10"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
                  </div>
                  <span
                    className={`text-[9px] mt-3 tracking-[0.15em] uppercase font-bold transition-colors duration-300 ${currentStep >= index
                      ? "text-[#13503B] group-hover:text-[#C5A059]"
                      : "text-gray-300"
                      }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Loader Screen */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
            <div className="relative mb-10">
              <Loader2 size={80} className="text-[#13503B] animate-spin opacity-20" />
              <Calculator size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#13503B] animate-pulse" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#13503B] mb-3">Calculating Estimate...</h2>
            <p className="text-gray-400 text-sm italic">Analyzing layout, measurements, and package specifications.</p>
          </div>
        )}

        {/* Component Content (Hidden while loading) */}
        {!isPending && (
          <div className={`p-8 md:p-12 ${currentStep === 4 ? "" : "min-h-[500px]"} flex flex-col`}>

            {/* ================= STEP 0: LAYOUT SELECTION ================= */}
            {currentStep === 0 && (
              <div className="animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#13503B]/5 rounded-full mb-6 text-[#13503B]">
                    <Calculator size={32} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">Select your kitchen layout</h2>
                  <p className="text-gray-500 text-sm">Choose the configuration that best fits your kitchen floor plan.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {kitchenLayouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => handleSelectLayout(layout.id)}
                      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 min-h-[160px] text-left group cursor-pointer ${selectedLayoutId === layout.id
                        ? "border-[#C5A059] shadow-lg scale-[1.02]"
                        : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                        }`}
                    >
                      <img
                        src={layout.graphic}
                        alt={layout.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 transition-all duration-300 z-10 ${selectedLayoutId === layout.id
                        ? "bg-gradient-to-t from-[#13503B]/95 via-[#13503B]/60 to-[#13503B]/20"
                        : "bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 group-hover:via-black/55"
                        }`} />

                      {selectedLayoutId === layout.id && (
                        <div className="absolute top-3 right-3 bg-[#C5A059] text-white rounded-full p-1 shadow-md z-20">
                          <CheckCircle2 size={14} />
                        </div>
                      )}

                      <div className="relative z-20 p-4 h-full flex flex-col justify-end min-h-[160px] pointer-events-none">
                        <span className="block text-base font-bold text-white tracking-wide">{layout.name}</span>
                        <span className="block text-[11px] text-gray-200 mt-1 max-w-[150px] line-clamp-2 leading-tight">
                          {layout.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STEP 1: MEASUREMENTS ================= */}
            {currentStep === 1 && (
              <div className="animate-fadeIn flex flex-col items-center">
                <div className="text-center mb-8 w-full">
                  <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">Review your measurements</h2>
                  <p className="text-gray-500 text-sm">Verify and adjust the dimensions of each counter wall segment in feet.</p>
                </div>

                {/* SVG Visualizer Container */}
                <div className="w-full max-w-md p-6 bg-[#13503B]/5 border border-[#13503B]/10 rounded-2xl shadow-inner mb-6 flex items-center justify-center min-h-[200px]">
                  {selectedLayoutId === "l-shaped" && (
                    <svg viewBox="0 0 300 200" className="w-full h-44 max-w-[260px]">
                      <path
                        d="M 70 40 L 230 40 L 230 80 L 110 80 L 110 160 L 70 160 Z"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text x="150" y="65" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">B</text>
                      <text x="90" y="125" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">A</text>
                    </svg>
                  )}
                  {selectedLayoutId === "straight" && (
                    <svg viewBox="0 0 300 200" className="w-full h-44 max-w-[260px]">
                      <rect
                        x="60"
                        y="80"
                        width="180"
                        height="40"
                        rx="8"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text x="150" y="106" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">A</text>
                    </svg>
                  )}
                  {selectedLayoutId === "u-shaped" && (
                    <svg viewBox="0 0 300 200" className="w-full h-44 max-w-[260px]">
                      <path
                        d="M 70 160 L 70 40 L 230 40 L 230 160 L 190 160 L 190 80 L 110 80 L 110 160 Z"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text x="90" y="115" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">A</text>
                      <text x="150" y="65" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">B</text>
                      <text x="210" y="115" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">C</text>
                    </svg>
                  )}
                  {selectedLayoutId === "parallel" && (
                    <svg viewBox="0 0 300 200" className="w-full h-44 max-w-[260px]">
                      <rect
                        x="70"
                        y="40"
                        width="40"
                        height="120"
                        rx="8"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="190"
                        y="40"
                        width="40"
                        height="120"
                        rx="8"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text x="90" y="105" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">A</text>
                      <text x="210" y="105" fill="#13503B" fontWeight="bold" fontSize="20" textAnchor="middle">B</text>
                    </svg>
                  )}
                </div>

                {/* Standard Notice Banner */}
                <div className="w-full max-w-md mb-6 bg-amber-50 border border-amber-200/50 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-amber-800 text-xs font-semibold shadow-sm">
                  <span className="text-sm">💡</span>
                  <span>Standard size has been set for your convenience</span>
                </div>

                {/* Form Input Dropdowns */}
                <div className="w-full max-w-md space-y-3">
                  {Object.keys(measurementsByLayout[selectedLayoutId || "l-shaped"]).map((key) => (
                    <div key={key} className="flex items-center justify-between w-full border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                      <span className="text-lg font-bold text-[#13503B] w-6">{key}</span>
                      <div className="relative flex-1 mx-4">
                        <MeasurementDropdown
                          value={measurementsByLayout[selectedLayoutId || "l-shaped"][key]}
                          onChange={(val) => {
                            setMeasurementsByLayout((prev) => ({
                              ...prev,
                              [selectedLayoutId || "l-shaped"]: {
                                ...prev[selectedLayoutId || "l-shaped"],
                                [key]: val,
                              },
                            }));
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-400 w-6 text-right">ft.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STEP 2: PACKAGE SELECTION (FINISH QUALITY) ================= */}
            {currentStep === 2 && (
              <div className="animate-fadeIn text-center">
                <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">Finish quality</h2>
                <p className="text-gray-500 text-sm mb-10">Select a package that fits your lifestyle and vision.</p>

                <div className="space-y-4 max-w-lg mx-auto">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setCurrentStep(3); // Auto-advance to the Get Quote step
                        setMaxStep((prev) => Math.max(prev, 3));
                      }}
                      className={`relative w-full text-left rounded-2xl border-2 transition-all duration-300 flex flex-col sm:flex-row gap-0 cursor-pointer overflow-hidden ${selectedPackageId === pkg.id
                        ? "border-[#C5A059] bg-[#C5A059]/5 shadow-lg scale-[1.02]"
                        : "border-gray-100 hover:border-[#13503B] bg-white hover:shadow-md hover:scale-[1.01]"
                        }`}
                    >
                      <img
                        src={pkg.graphic}
                        alt={pkg.name}
                        className="w-full h-40 sm:w-36 sm:h-32 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 p-5 md:p-6 min-w-0 flex flex-col justify-center relative text-left">
                        {pkg.tag && (
                          <span className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-[#13503B]/5 rounded-full text-[#13503B]">
                            {pkg.tag}
                          </span>
                        )}
                        <span className="block font-black text-lg md:text-xl text-[#13503B] mb-1.5">{pkg.name}</span>
                        <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed pr-8 sm:pr-12">{pkg.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STEP 3: GET QUOTE ================= */}
            {currentStep === 3 && (
              <Step3Quote onSubmit={submitToBackend} loading={isPending} />
            )}

            {/* ================= STEP 4: ESTIMATE RESULT SCREEN ================= */}
            {currentStep === 4 && estimatedPrice !== null && (
              <div className="text-center animate-fadeIn py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8 text-green-600 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>

                <h2 className="text-2xl font-serif text-gray-500 mb-2">Your Estimated Investment</h2>
                <div className="text-5xl md:text-6xl font-black text-[#13503B] mb-10 tracking-tight">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(estimatedPrice)}
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100 text-left">
                  <h3 className="font-bold text-[#13503B] mb-2">What happens next?</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Our designer will contact you within 24 hours at <span className="font-semibold text-gray-700">{form.phone}</span> to discuss your
                    vision and provide a free 3D design consultation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-[#13503B] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#13503B]/10 hover:bg-[#0d3528] active:scale-95 transition-all">
                      Book Consultation
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white text-[#13503B] border-2 border-gray-100 py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors hover:bg-gray-50 active:scale-95 transition-all">
                      Pricing Guide
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-[10px] italic">
                  *This is a preliminary estimate. Final pricing may vary based on site conditions and material selections.
                </p>
              </div>
            )}

            {/* 6. Footer Navigation Buttons (Hidden on result screen) */}
            {currentStep < 4 && (
              <div className="mt-auto pt-10 flex justify-between items-center w-full">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-[#13503B] hover:border-[#13503B] px-6 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-gray-50/50 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                  GO BACK
                </button>

                {currentStep === 1 && (
                  <button
                    onClick={handleNext}
                    className="group flex items-center gap-2 bg-[#13503B] text-white px-8 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                  >
                    CONTINUE
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
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
        <p className="text-gray-400 text-sm italic">Analyzing layout, measurements, and package specifications.</p>
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
      <p className="text-gray-500 text-sm mb-10">Enter your details to reveal your personalized kitchen estimate.</p>

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

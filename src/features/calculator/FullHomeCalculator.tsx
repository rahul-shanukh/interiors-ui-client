import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, ArrowLeft, Calculator, Loader2, Sparkles, Phone, User, Mail, Download, X, MapPin, ChevronDown, Search } from "lucide-react";
import type {
  CalculatorBuildData,
  RoomCounts,
  CustomerDetails,
  QuoteRequest,
} from "./types";
import { useQuote } from "./useQuote";
import { COUNTRY_CODES } from "./countryCodes";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import essentialImg from "../../assets/essential.png";
import premiumImg from "../../assets/premium.png";
import luxeImg from "../../assets/luxe.png";

const BHK_ROOM_CONFIGS: Record<
  string,
  {
    defaults: RoomCounts;
    maxLiving?: number;
    maxKitchen?: number;
    maxBedrooms: number;
    maxBathrooms: number;
    maxDining: number;
    areaOptions: string[];
  }
> = {
  "1 BHK": {
    defaults: {
      living: 1,
      kitchen: 1,
      bedroom: 1,
      bathroom: 1,
      dining: 0,
    },
    maxLiving: 2,
    maxKitchen: 2,
    maxBedrooms: 1,
    maxBathrooms: 1,
    maxDining: 1,
    areaOptions: [
      "Below 800 sq. ft.",
      "Above 800 sq. ft.",
    ],
  },

  "2 BHK": {
    defaults: {
      living: 1,
      kitchen: 1,
      bedroom: 2,
      bathroom: 2,
      dining: 1,
    },
    maxLiving: 2,
    maxKitchen: 2,
    maxBedrooms: 2,
    maxBathrooms: 2,
    maxDining: 2,
    areaOptions: [
      "Below 800 sq. ft.",
      "Above 800 sq. ft.",
    ],
  },

  "3 BHK": {
    defaults: {
      living: 1,
      kitchen: 1,
      bedroom: 3,
      bathroom: 3,
      dining: 1,
    },
    maxLiving: 2,
    maxKitchen: 2,
    maxBedrooms: 3,
    maxBathrooms: 3,
    maxDining: 2,
    areaOptions: [
      "Below 1200 sq. ft.",
      "Above 1200 sq. ft.",
    ],
  },

  "4+ BHK / Villa": {
    defaults: {
      living: 1,
      kitchen: 1,
      bedroom: 4,
      bathroom: 4,
      dining: 1,
    },
    maxLiving: 10,
    maxKitchen: 10,
    maxBedrooms: 10,
    maxBathrooms: 10,
    maxDining: 10,
    areaOptions: [
      "Below 1600 sq. ft.",
      "Above 1600 sq. ft.",
    ],
  },
};

export const FullHomeCalculator = () => {
  const [step, setStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useQuote();

  const [buildData, setBuildData] = useState<CalculatorBuildData>({
    bhkType: null,
    areaSize: null,
    rooms: { living: 1, kitchen: 1, bedroom: 2, bathroom: 2, dining: 1 },
    packageLevel: null,
    customerDetails: null,
  });

  const steps = ["BHK TYPE", "ROOMS", "PACKAGE", "GET QUOTE"];

  const updateBuild = <K extends keyof CalculatorBuildData>(
    key: K,
    value: CalculatorBuildData[K],
  ) => {
    setBuildData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const submitToBackend = async (customerDetails: CustomerDetails) => {
    const finalPayload: QuoteRequest = {
      bhkType: buildData.bhkType || "",
      areaSize: buildData.areaSize || "",
      rooms: buildData.rooms,
      package: buildData.packageLevel || "",
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      city: customerDetails.city,
      latitude: customerDetails.latitude,
      longitude: customerDetails.longitude,
    };

    try {
      const response = await mutateAsync(finalPayload);
      setEstimatedPrice(response.estimatedPrice);
      setStep(5);
    } catch (error) {
      // Error is handled by useMutation onError
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-2 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        {/* Progress Bar Header - Hide on Success */}
        {step < 5 && (
          <div className="bg-white px-8 py-8 border-b border-gray-50 flex justify-between items-center relative">
            <div className="absolute top-[50px] left-10 right-10 h-0.5 bg-gray-100 -z-0"></div>
            <div
              className="absolute top-[50px] left-10 right-10 h-0.5 bg-[#13503B] transition-transform duration-700 origin-left -z-0"
              style={{ transform: `scaleX(${(step - 1) / 3})` }}
            ></div>

            {steps.map((label, index) => {
              const targetStep = index + 1;
              const isBackward = targetStep < step;
              return (
                <button
                  key={label}
                  onClick={() => {
                    if (isBackward) {
                      setStep(targetStep);
                    }
                  }}
                  disabled={!isBackward}
                  className={`flex flex-col items-center z-10 bg-white px-2 focus:outline-none transition-all duration-300 ${isBackward ? "cursor-pointer group" : "cursor-default"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step > targetStep
                      ? "bg-[#13503B] text-white group-hover:bg-[#13503B]/80 group-hover:scale-105"
                      : step === targetStep
                        ? "bg-[#C5A059] text-white ring-8 ring-[#C5A059]/10"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {step > targetStep ? <CheckCircle2 size={16} /> : targetStep}
                  </div>
                  <span
                    className={`text-[9px] mt-3 tracking-[0.15em] uppercase font-bold transition-colors duration-300 ${step >= targetStep
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

        <div className={`p-8 md:p-12 ${step === 5 ? "" : "min-h-[500px]"} flex flex-col`}>
          {step === 1 && (
            <Step1Bhk
              current={buildData.bhkType}
              areaSize={buildData.areaSize}
              areaOptions={buildData.bhkType ? BHK_ROOM_CONFIGS[buildData.bhkType]?.areaOptions : []}
              onSelect={(val) => {
                const config = BHK_ROOM_CONFIGS[val];
                setBuildData((prev) => ({
                  ...prev,
                  bhkType: val,
                  areaSize: null,
                  rooms: config ? config.defaults : prev.rooms,
                }));
              }}
              onSelectArea={(val) => {
                updateBuild("areaSize", val);
              }}
              onContinue={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Rooms
              counts={buildData.rooms}
              bhkType={buildData.bhkType}
              onChange={(val) => updateBuild("rooms", val)}
            />
          )}
          {step === 3 && (
            <Step3Package
              current={buildData.packageLevel}
              onSelect={(val) => {
                updateBuild("packageLevel", val);
                handleNext();
              }}
            />
          )}
          {step === 4 && (
            <Step4Quote onSubmit={submitToBackend} loading={isPending} />
          )}
          {step === 5 && estimatedPrice !== null && (
            <Step5Result price={estimatedPrice} />
          )}

          {step < 5 && (
            <div className="mt-auto pt-10 flex justify-between items-center w-full">
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-[#13503B] hover:border-[#13503B] px-6 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-gray-50/50 active:scale-95 cursor-pointer shadow-sm"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                GO BACK
              </button>

              {(step === 1 || step === 2) && (
                <button
                  onClick={handleNext}
                  disabled={step === 1 ? (!buildData.bhkType || !buildData.areaSize) : false}
                  className="group flex items-center gap-2 bg-[#13503B] text-white px-8 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                >
                  CONTINUE
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const Step1Bhk = ({
  current,
  areaSize,
  areaOptions,
  onSelect,
  onSelectArea,
  onContinue,
}: {
  current: string | null;
  areaSize: string | null;
  areaOptions: string[];
  onSelect: (val: string) => void;
  onSelectArea: (val: string) => void;
  onContinue: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempAreaSize, setTempAreaSize] = useState<string | null>(areaSize);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const options = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK / Villa"];
  return (
    <div className="text-center animate-fadeIn">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#13503B]/5 rounded-full mb-6 text-[#13503B]">
        <Calculator size={32} />
      </div>
      {/* <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-3">
        Select your floor plan
      </h2>
      <p className="text-gray-500 text-sm mb-10">Choose the configuration that best describes your home.</p> */}
      <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-3">
        Let's Build Your Dream Interior
      </h2>
      <p className="text-gray-500 text-sm mb-10">
        Start by selecting your home type. We'll guide you through the rest.{" "}
        <button
          onClick={() => setShowInfoPopup(true)}
          className="text-[#13503B] underline font-semibold hover:text-[#C5A059] transition-colors cursor-pointer inline"
        >
          click here
        </button>
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              onSelect(opt);
              setTempAreaSize(current === opt ? areaSize : null);
              setShowModal(true);
            }}
            className={`py-6 px-4 rounded-xl border-2 font-bold transition-all duration-300 flex flex-col items-center justify-center min-h-[96px] ${current === opt
              ? "border-[#C5A059] bg-[#C5A059]/5 text-[#13503B] shadow-inner"
              : "border-gray-100 text-gray-500 hover:border-[#13503B] hover:bg-gray-50"
              }`}
          >
            <span className="block text-base">{opt}</span>
            {current === opt && areaSize && (
              <span className="block text-xs text-[#C5A059] mt-2 font-medium bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full">
                {areaSize}
              </span>
            )}
          </button>
        ))}
      </div>

      {showModal && current && areaOptions.length > 0 && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-[#13503B]/15 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_30px_70px_rgba(19,80,59,0.08),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/40 animate-scaleIn text-left relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#13503B] transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif font-black text-[#13503B] mb-2">
              Select Area Size
            </h3>
            <p className="text-[#13503B]/60 text-xs font-semibold leading-relaxed mb-6">
              Please specify the square footage of your <span className="font-semibold text-[#13503B]">{current}</span> home.
            </p>

            <div className="space-y-3 mb-8">
              {areaOptions.map((areaOpt) => (
                <button
                  key={areaOpt}
                  onClick={() => setTempAreaSize(areaOpt)}
                  className={`w-full py-4 px-6 rounded-xl border font-bold text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] flex justify-between items-center ${tempAreaSize === areaOpt
                    ? "border-[#C5A059] bg-white/90 text-[#13503B] shadow-[0_8px_20px_rgba(197,160,89,0.06)]"
                    : "border-white/50 bg-white/30 text-gray-500 hover:border-[#13503B]/30 hover:bg-white/60"
                    }`}
                >
                  <span>{areaOpt}</span>
                  {tempAreaSize === areaOpt && (
                    <CheckCircle2 size={20} className="text-[#C5A059]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 rounded-xl border border-white/50 bg-white/20 text-gray-500 font-bold hover:text-gray-700 hover:bg-white/40 transition-all text-xs tracking-widest uppercase active:scale-98"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempAreaSize) {
                    onSelectArea(tempAreaSize);
                    setShowModal(false);
                    onContinue();
                  }
                }}
                disabled={!tempAreaSize}
                className="flex-1 py-4 rounded-xl bg-[#13503B]/90 text-white font-bold hover:bg-[#13503B] hover:shadow-lg hover:shadow-[#13503B]/10 transition-all disabled:opacity-30 disabled:pointer-events-none text-xs tracking-widest uppercase active:scale-98"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showInfoPopup && (
        <div
          onClick={() => setShowInfoPopup(false)}
          className="fixed inset-0 bg-[#13503B]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_30px_70px_rgba(19,80,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/50 animate-scaleIn text-left relative"
          >
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#13503B] transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#13503B]/10 rounded-full mb-4 text-[#13503B]">
              <Sparkles size={24} />
            </div>

            <h3 className="text-2xl font-serif font-black text-[#13503B] mb-3">
              How It Works
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Select your floor plan configuration to begin. Our advanced AI calculator compiles material pricing, labor estimates, and professional design packages tailored to your specific layout.
            </p>

            <button
              onClick={() => setShowInfoPopup(false)}
              className="w-full py-4 rounded-xl bg-[#13503B] text-white font-bold hover:bg-[#0d3528] transition-all text-xs tracking-widest uppercase active:scale-95 cursor-pointer shadow-lg shadow-[#13503B]/15"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Step2Rooms = ({
  counts,
  bhkType,
  onChange,
}: {
  counts: RoomCounts;
  bhkType: string | null;
  onChange: (val: RoomCounts) => void;
}) => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const config = bhkType ? BHK_ROOM_CONFIGS[bhkType] : null;
  const maxLiving = config?.maxLiving ?? 99;
  const maxKitchen = config?.maxKitchen ?? 99;
  const maxBedrooms = config?.maxBedrooms ?? 99;
  const maxBathrooms = config?.maxBathrooms ?? 99;
  const maxDining = config?.maxDining ?? 99;

  const updateCount = (room: keyof RoomCounts, delta: number) => {
    const nextVal = counts[room] + delta;
    if (room === "living" && nextVal > maxLiving) {
      return;
    }
    if (room === "kitchen" && nextVal > maxKitchen) {
      return;
    }
    if (room === "bedroom" && nextVal > maxBedrooms) {
      return;
    }
    if (room === "bathroom" && nextVal > maxBathrooms) {
      return;
    }
    if (room === "dining" && nextVal > maxDining) {
      return;
    }
    onChange({ ...counts, [room]: Math.max(0, nextVal) });
  };
  const roomsList: { key: keyof RoomCounts; label: string }[] = [
    { key: "living", label: "Living Room" },
    { key: "kitchen", label: "Kitchen" },
    { key: "bedroom", label: "Bedroom" },
    { key: "bathroom", label: "Bathroom" },
    { key: "dining", label: "Dining Area" },
  ];
  return (
    <div className="text-center animate-fadeIn flex flex-col items-center">
      <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">
        Rooms to design
      </h2>
      <p className="text-gray-500 text-sm mb-10">
        Adjust the count for each area you want us to work on.{" "}
        <button
          type="button"
          onClick={() => setShowInfoPopup(true)}
          className="text-[#13503B] underline font-semibold hover:text-[#C5A059] transition-colors cursor-pointer inline"
        >
          click here
        </button>
      </p>

      <div className="w-full max-w-md space-y-3">
        {roomsList.map(({ key, label }) => {
          let isPlusDisabled = false;
          if (key === "living" && counts[key] >= maxLiving) isPlusDisabled = true;
          if (key === "kitchen" && counts[key] >= maxKitchen) isPlusDisabled = true;
          if (key === "bedroom" && counts[key] >= maxBedrooms) isPlusDisabled = true;
          if (key === "bathroom" && counts[key] >= maxBathrooms) isPlusDisabled = true;
          if (key === "dining" && counts[key] >= maxDining) isPlusDisabled = true;
          return (
            <div
              key={key}
              className="flex items-center justify-between border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <span className="font-bold text-[#13503B]">{label}</span>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => updateCount(key, -1)}
                  className="w-10 h-10 rounded-full bg-gray-100 text-[#13503B] font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="w-4 font-black text-lg">{counts[key]}</span>
                <button
                  onClick={() => updateCount(key, 1)}
                  disabled={isPlusDisabled}
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${isPlusDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-[#13503B] text-white hover:bg-[#0d3528]"
                    }`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showInfoPopup && (
        <div
          onClick={() => setShowInfoPopup(false)}
          className="fixed inset-0 bg-[#13503B]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_30px_70px_rgba(19,80,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/50 animate-scaleIn text-left relative"
          >
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#13503B] transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#13503B]/10 rounded-full mb-4 text-[#13503B]">
              <Sparkles size={24} />
            </div>

            <h3 className="text-2xl font-serif font-black text-[#13503B] mb-3">
              How It Works
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Select your floor plan configuration to begin. Our advanced AI calculator compiles material pricing, labor estimates, and professional design packages tailored to your specific layout.
            </p>

            <button
              onClick={() => setShowInfoPopup(false)}
              className="w-full py-4 rounded-xl bg-[#13503B] text-white font-bold hover:bg-[#0d3528] transition-all text-xs tracking-widest uppercase active:scale-95 cursor-pointer shadow-lg shadow-[#13503B]/15"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Step3Package = ({
  current,
  onSelect,
}: {
  current: string | null;
  onSelect: (val: string) => void;
}) => {
  const packages = [
    {
      name: "Essential",
      desc: "Best value with standard premium materials.",
      tag: "Budget Friendly",
      image: essentialImg,
    },
    {
      name: "Premium",
      desc: "High-quality finishes with designer touches.",
      tag: "Most Popular",
      image: premiumImg,
    },
    {
      name: "Luxury",
      desc: "Elite imported materials and customized luxury.",
      tag: "Signature",
      image: luxeImg,
    },
  ];
  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">
        Finish quality
      </h2>
      <p className="text-gray-500 text-sm mb-10">Select a package that fits your lifestyle and vision.</p>

      <div className="space-y-4 max-w-lg mx-auto">
        {packages.map((pkg) => (
          <button
            key={pkg.name}
            onClick={() => onSelect(pkg.name)}
            className={`relative w-full text-left rounded-2xl border-2 transition-all duration-300 flex flex-col sm:flex-row gap-0 cursor-pointer overflow-hidden ${current === pkg.name
              ? "border-[#C5A059] bg-[#C5A059]/5 shadow-lg scale-[1.02]"
              : "border-gray-100 hover:border-[#13503B] bg-white hover:shadow-md hover:scale-[1.01]"
              }`}
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-40 sm:w-36 sm:h-32 object-cover flex-shrink-0"
            />
            <div className="flex-1 p-5 md:p-6 min-w-0 flex flex-col justify-center relative">
              {pkg.tag && (
                <span className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-[#13503B]/5 rounded-full text-[#13503B]">
                  {pkg.tag}
                </span>
              )}
              <span className="block font-black text-lg md:text-xl text-[#13503B] mb-1.5">{pkg.name}</span>
              <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed pr-8 sm:pr-12">{pkg.desc}</p>
            </div>
          </button>
        ))}
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


const Step4Quote = ({
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

  // handleSelectCity must be declared before selectCityRef.current assignment
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

  // useCallback ref: runs instantly when the DOM node mounts/unmounts.
  // No extra render cycle needed — React calls this directly.
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
        <p className="text-gray-400 text-sm italic">Analyzing materials, labor, and project scope.</p>
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
      <p className="text-gray-500 text-sm mb-10">Enter your details to reveal your personalized interior estimate.</p>

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
              // Delay allows clicking the select button on suggestions before it gets hidden
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
          className="w-full mt-6 bg-[#13503B] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-30 shadow-2xl shadow-[#13503B]/20 transition-all active:scale-95 cursor-pointer"
        >
          Reveal My Estimate
        </button>
        <p className="text-[10px] text-gray-400 mt-6">By clicking, you agree to receive a copy of your quote on WhatsApp.</p>
      </div>
    </div>
  );
};

const Step5Result = ({ price }: { price: number }) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="text-center animate-fadeIn py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8 text-green-600 shadow-inner">
        <CheckCircle2 size={40} />
      </div>

      <h2 className="text-2xl font-serif text-gray-500 mb-2">Your Estimated Investment</h2>
      <div className="text-5xl md:text-6xl font-black text-[#13503B] mb-10 tracking-tight">
        {formatted}
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
        <h3 className="font-bold text-[#13503B] mb-2">What happens next?</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Our designer will contact you within 24 hours to discuss your
          vision and provide a free 3D design consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-[#13503B] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#13503B]/10">
            Book Consultation
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white text-[#13503B] border-2 border-gray-100 py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors hover:bg-gray-50">
            <Download size={14} />
            Pricing Guide
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-[10px] italic">
        *This is a preliminary estimate. Final pricing may vary based on site conditions and material selections.
      </p>
    </div>
  );
};

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calculator,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { useQuote } from "../../../entities/quote/hooks/useQuoteMutation";
import type { CustomerDetails } from "../../../entities/quote/model/quote.types";
import { mapKitchenUiToQuoteRequest } from "../mappers/calculator.mapper";
import { useQuery } from "@tanstack/react-query";
import { QuoteContactStep } from "./reuse_components/QuoteContactStep";
import { getAssetUrl } from "../../../shared/utils/getAssetUrl";
import { ASSETS } from "../../../assets/assetRegistry";

const kitchenLayouts = [
  {
    id: "l-shaped",
    name: "L-shaped",
    description: "Corner-optimized for a logical, efficient work triangle.",
    graphic: getAssetUrl(ASSETS.calculator.kitchen.lShaped),
  },
  {
    id: "straight",
    name: "Straight",
    description: "Compact and simple, perfect for single-wall spaces.",
    graphic: getAssetUrl(ASSETS.calculator.kitchen.straight),
  },
  {
    id: "u-shaped",
    name: "U-shaped",
    description: "Maximized counter space and a versatile cooking zone.",
    graphic: getAssetUrl(ASSETS.calculator.kitchen.uShaped),
  },
  {
    id: "parallel",
    name: "Parallel",
    description: "Two parallel countertops and work zones facing each other.",
    graphic: getAssetUrl(ASSETS.calculator.kitchen.parallel),
  },
];

const PACKAGES = [
  {
    id: "essential",
    name: "Essential",
    tag: "Budget Friendly",
    description:
      "Sturdy and durable finishes using quality laminate and standard hardware.",
    graphic: getAssetUrl(ASSETS.calculator.packages.kitchen.kessential),
  },
  {
    id: "premium",
    name: "Premium",
    tag: "Most Popular",
    description:
      "High-gloss acrylic finishes, premium wire accessories, and branded hardware.",
    graphic: getAssetUrl(ASSETS.calculator.packages.kitchen.kpremium),
  },
  {
    id: "luxe",
    name: "Luxury",
    tag: "Signature Luxury",
    description:
      "Imported PU finishes, custom hardware, and elite luxury styling.",
    graphic: getAssetUrl(ASSETS.calculator.packages.kitchen.kluxury),
  },
];

interface MeasurementDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const MeasurementDropdown: React.FC<MeasurementDropdownProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: options = [] } = useQuery<number[]>({
    queryKey: ["measurementOptions"],
    queryFn: () => Array.from({ length: 19 }, (_, i) => i + 2),
    staleTime: Infinity,
  });

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, num: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(num);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="relative w-full animate-fadeIn"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 rounded-xl py-3 px-4 text-base font-bold text-gray-800 cursor-pointer transition-all outline-none"
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-[999] max-h-48 overflow-y-auto divide-y divide-gray-50 animate-fadeIn"
        >
          {options.map((num) => (
            <button
              key={num}
              type="button"
              role="option"
              aria-selected={value === num}
              onClick={() => {
                onChange(num);
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, num)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 transition-colors font-bold text-sm text-gray-700 outline-none ${
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

export const KitchenCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("premium");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { mutateAsync, isPending } = useQuote();

  const [measurementsByLayout, setMeasurementsByLayout] = useState<
    Record<string, Record<string, number>>
  >({
    "l-shaped": { A: 3, B: 8 },
    straight: { A: 8 },
    "u-shaped": { A: 8, B: 10, C: 8 },
    parallel: { A: 8, B: 8 },
  });

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

    const layoutNameMap = Object.fromEntries(
      kitchenLayouts.map((l) => [l.id, l.name]),
    );
    const packageNameMap = Object.fromEntries(
      PACKAGES.map((p) => [p.id, p.name]),
    );

    const payload = mapKitchenUiToQuoteRequest({
      selectedLayoutId,
      selectedPackageId,
      measurements: measurementsByLayout[selectedLayoutId],
      customerDetails,
      layoutNameMap,
      packageNameMap,
    });

    setForm(customerDetails);

    try {
      const response = await mutateAsync(payload);
      setEstimatedPrice(response.estimatedPrice);
      setCurrentStep(4);
    } catch (error) {
      console.error(
        "Failed to generate calculation from backend engine:",
        error,
      );
    }
  };

  const steps = ["Kitchen Layout", "Measurements", "Package", "Get Quote"];

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-2 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col">
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
                    if (isClickable) setCurrentStep(index);
                  }}
                  disabled={!isClickable}
                  className={`flex flex-col items-center z-10 bg-white px-2 focus:outline-none transition-all duration-300 ${isClickable ? "cursor-pointer group" : "cursor-default"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      isCompleted
                        ? "bg-[#13503B] text-white group-hover:bg-[#13503B]/80 group-hover:scale-105"
                        : isActive
                          ? "bg-[#C5A059] text-white ring-8 ring-[#C5A059]/10"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
                  </div>
                  <span
                    className={`text-[9px] mt-3 tracking-[0.15em] uppercase font-bold transition-colors duration-300 ${currentStep >= index ? "text-[#13503B] group-hover:text-[#C5A059]" : "text-gray-300"}`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
            <div className="relative mb-10">
              <LoaderCircle
                size={80}
                className="text-[#13503B] animate-spin opacity-20"
              />
              <Calculator
                size={32}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#13503B] animate-pulse"
              />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#13503B] mb-3">
              Calculating Estimate...
            </h2>
            <p className="text-gray-400 text-sm italic">
              Analyzing layout, measurements, and package specifications.
            </p>
          </div>
        )}

        {!isPending && (
          <div
            className={`p-8 md:p-12 ${currentStep === 4 ? "" : "min-h-[500px]"} flex flex-col`}
          >
            {currentStep === 0 && (
              <div className="animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#13503B]/5 rounded-full mb-6 text-[#13503B]">
                    <Calculator size={32} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">
                    Select your kitchen layout
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Choose the configuration that best fits your kitchen floor
                    plan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {kitchenLayouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => handleSelectLayout(layout.id)}
                      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 min-h-[160px] text-left group cursor-pointer ${
                        selectedLayoutId === layout.id
                          ? "border-[#C5A059] shadow-lg scale-[1.02]"
                          : "border-gray-100 hover:border-[#13503B] hover:shadow-md hover:scale-[1.01]"
                      }`}
                    >
                      <img
                        src={layout.graphic}
                        alt={layout.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-300 z-10 ${
                          selectedLayoutId === layout.id
                            ? "bg-gradient-to-t from-[#13503B]/95 via-[#13503B]/60 to-[#13503B]/20"
                            : "bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 group-hover:via-black/55"
                        }`}
                      />

                      {selectedLayoutId === layout.id && (
                        <div className="absolute top-3 right-3 bg-[#C5A059] text-white rounded-full p-1 shadow-md z-20">
                          <CheckCircle2 size={14} />
                        </div>
                      )}

                      <div className="relative z-20 p-4 h-full flex flex-col justify-end min-h-[160px] pointer-events-none">
                        <span className="block text-base font-bold text-white tracking-wide">
                          {layout.name}
                        </span>
                        <span className="block text-[11px] text-gray-200 mt-1 max-w-[150px] line-clamp-2 leading-tight">
                          {layout.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fadeIn flex flex-col items-center">
                <div className="text-center mb-8 w-full">
                  <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">
                    Review your measurements
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Verify and adjust the dimensions of each counter wall
                    segment in feet.
                  </p>
                </div>

                <div className="w-full max-w-md p-6 bg-[#13503B]/5 border border-[#13503B]/10 rounded-2xl shadow-inner mb-6 flex items-center justify-center min-h-[200px]">
                  {selectedLayoutId === "l-shaped" && (
                    <svg
                      viewBox="0 0 300 200"
                      className="w-full h-44 max-w-[260px]"
                    >
                      <path
                        d="M 70 40 L 230 40 L 230 80 L 110 80 L 110 160 L 70 160 Z"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text
                        x="150"
                        y="65"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        B
                      </text>
                      <text
                        x="90"
                        y="125"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        A
                      </text>
                    </svg>
                  )}
                  {selectedLayoutId === "straight" && (
                    <svg
                      viewBox="0 0 300 200"
                      className="w-full h-44 max-w-[260px]"
                    >
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
                      <text
                        x="150"
                        y="106"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        A
                      </text>
                    </svg>
                  )}
                  {selectedLayoutId === "u-shaped" && (
                    <svg
                      viewBox="0 0 300 200"
                      className="w-full h-44 max-w-[260px]"
                    >
                      <path
                        d="M 70 160 L 70 40 L 230 40 L 230 160 L 190 160 L 190 80 L 110 80 L 110 160 Z"
                        fill="#f5ebdc"
                        stroke="#c5a059"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <text
                        x="90"
                        y="115"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        A
                      </text>
                      <text
                        x="150"
                        y="65"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        B
                      </text>
                      <text
                        x="210"
                        y="115"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        C
                      </text>
                    </svg>
                  )}
                  {selectedLayoutId === "parallel" && (
                    <svg
                      viewBox="0 0 300 200"
                      className="w-full h-44 max-w-[260px]"
                    >
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
                      <text
                        x="90"
                        y="105"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        A
                      </text>
                      <text
                        x="210"
                        y="105"
                        fill="#13503B"
                        fontWeight="bold"
                        fontSize="20"
                        textAnchor="middle"
                      >
                        B
                      </text>
                    </svg>
                  )}
                </div>

                <div className="w-full max-w-md mb-6 bg-amber-50 border border-amber-200/50 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-amber-800 text-xs font-semibold shadow-sm">
                  <span className="text-sm">💡</span>
                  <span>Standard size has been set for your convenience</span>
                </div>

                <div className="w-full max-w-md space-y-3">
                  {Object.keys(
                    measurementsByLayout[selectedLayoutId || "l-shaped"],
                  ).map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between w-full border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
                    >
                      <span className="text-lg font-bold text-[#13503B] w-6">
                        {key}
                      </span>
                      <div className="relative flex-1 mx-4">
                        <MeasurementDropdown
                          value={
                            measurementsByLayout[
                              selectedLayoutId || "l-shaped"
                            ][key]
                          }
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
                      <span className="text-sm font-bold text-gray-400 w-6 text-right">
                        ft.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fadeIn text-center">
                <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-2">
                  Finish quality
                </h2>
                <p className="text-gray-500 text-sm mb-10">
                  Select a package that fits your lifestyle and vision.
                </p>

                <div className="space-y-4 max-w-lg mx-auto">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setCurrentStep(3);
                        setMaxStep((prev) => Math.max(prev, 3));
                      }}
                      className={`relative w-full text-left rounded-2xl border-2 transition-all duration-300 flex flex-col sm:flex-row gap-0 cursor-pointer overflow-hidden ${
                        selectedPackageId === pkg.id
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
                        <span className="block font-black text-lg md:text-xl text-[#13503B] mb-1.5">
                          {pkg.name}
                        </span>
                        <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed pr-8 sm:pr-12">
                          {pkg.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <QuoteContactStep
                onSubmit={submitToBackend}
                loading={isPending}
                headingText="Almost ready!"
                descriptionText="Enter your details to reveal your personalized kitchen estimate."
              />
            )}

            {currentStep === 4 && estimatedPrice !== null && (
              <div className="text-center animate-fadeIn py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8 text-green-600 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>

                <h2 className="text-2xl font-serif text-gray-500 mb-2">
                  Your Estimated Investment
                </h2>
                <div className="text-5xl md:text-6xl font-black text-[#13503B] mb-10 tracking-tight">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(estimatedPrice)}
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100 text-left">
                  <h3 className="font-bold text-[#13503B] mb-2">
                    What happens next?
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Our designer will contact you within 24 hours at{" "}
                    <span className="font-semibold text-gray-700">
                      {form.phone}
                    </span>{" "}
                    to discuss your vision and provide a free 3D design
                    consultation.
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
                  *This is a preliminary estimate. Final pricing may vary based
                  on site conditions and material selections.
                </p>
              </div>
            )}

            {currentStep < 4 && (
              <div className="mt-auto pt-10 flex justify-between items-center w-full">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-[#13503B] hover:border-[#13503B] px-6 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-gray-50/50 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                  GO BACK
                </button>

                {currentStep === 1 && (
                  <button
                    onClick={handleNext}
                    className="group flex items-center gap-2 bg-[#13503B] text-white px-8 py-3.5 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                  >
                    CONTINUE
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
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

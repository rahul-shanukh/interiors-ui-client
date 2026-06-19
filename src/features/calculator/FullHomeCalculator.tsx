import { useState } from "react";
import { CheckCircle2, ChevronRight, Calculator, Loader2, Sparkles, Phone, User, Mail, Download } from "lucide-react";
import type {
  CalculatorBuildData,
  RoomCounts,
  CustomerDetails,
  QuoteRequest,
} from "./types";
import { useQuote } from "./useQuote";

export const FullHomeCalculator = () => {
  const [step, setStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const { mutateAsync, isPending } = useQuote();

  const [buildData, setBuildData] = useState<CalculatorBuildData>({
    bhkType: null,
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
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitToBackend = async (customerDetails: CustomerDetails) => {
    const finalPayload: QuoteRequest = {
      bhkType: buildData.bhkType || "",
      rooms: buildData.rooms,
      package: buildData.packageLevel || "",
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
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
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        {/* Progress Bar Header - Hide on Success */}
        {step < 5 && (
          <div className="bg-white px-8 py-8 border-b border-gray-50 flex justify-between items-center relative">
            <div className="absolute top-[50px] left-10 right-10 h-0.5 bg-gray-100 -z-0"></div>
            <div
              className="absolute top-[50px] left-10 h-0.5 bg-[#13503B] transition-all duration-700 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {steps.map((label, index) => (
              <div
                key={label}
                className="flex flex-col items-center z-10 bg-white px-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step > index + 1
                      ? "bg-[#13503B] text-white"
                      : step === index + 1
                        ? "bg-[#C5A059] text-white ring-8 ring-[#C5A059]/10"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > index + 1 ? <CheckCircle2 size={16} /> : index + 1}
                </div>
                <span
                  className={`text-[9px] mt-3 tracking-[0.15em] uppercase font-bold ${
                    step >= index + 1 ? "text-[#13503B]" : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={`p-8 md:p-12 ${step === 5 ? "" : "min-h-[500px]"} flex flex-col`}>
          {step === 1 && (
            <Step1Bhk
              current={buildData.bhkType}
              onSelect={(val) => {
                updateBuild("bhkType", val);
                handleNext();
              }}
            />
          )}
          {step === 2 && (
            <Step2Rooms
              counts={buildData.rooms}
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

          {step < 4 && (
            <div className="mt-auto pt-10 flex justify-between items-center">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="text-gray-400 font-bold tracking-widest text-xs hover:text-[#13503B] transition-colors"
                >
                  ← GO BACK
                </button>
              ) : <div />}
              
              {step === 2 && (
                <button
                  onClick={handleNext}
                  className="group flex items-center gap-2 bg-[#13503B] text-white px-8 py-4 rounded-full font-bold tracking-widest text-xs transition-all hover:bg-[#0d3528] shadow-xl shadow-[#13503B]/20"
                >
                  CONTINUE
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
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
  onSelect,
}: {
  current: string | null;
  onSelect: (val: string) => void;
}) => {
  const options = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK / Villa"];
  return (
    <div className="text-center animate-fadeIn">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#13503B]/5 rounded-full mb-6 text-[#13503B]">
        <Calculator size={32} />
      </div>
      <h2 className="text-3xl font-serif font-bold text-[#13503B] mb-3">
        Select your floor plan
      </h2>
      <p className="text-gray-500 text-sm mb-10">Choose the configuration that best describes your home.</p>
      
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`py-6 rounded-xl border-2 font-bold transition-all duration-300 ${
              current === opt
                ? "border-[#C5A059] bg-[#C5A059]/5 text-[#13503B] shadow-inner"
                : "border-gray-100 text-gray-500 hover:border-[#13503B] hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const Step2Rooms = ({
  counts,
  onChange,
}: {
  counts: RoomCounts;
  onChange: (val: RoomCounts) => void;
}) => {
  const updateCount = (room: keyof RoomCounts, delta: number) => {
    onChange({ ...counts, [room]: Math.max(0, counts[room] + delta) });
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
      <p className="text-gray-500 text-sm mb-10">Adjust the count for each area you want us to work on.</p>
      
      <div className="w-full max-w-md space-y-3">
        {roomsList.map(({ key, label }) => (
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
                className="w-10 h-10 rounded-full bg-[#13503B] text-white font-bold flex items-center justify-center hover:bg-[#0d3528] transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
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
    { name: "Essential", desc: "Best value with standard premium materials.", tag: "Budget Friendly" },
    { name: "Premium", desc: "High-quality finishes with designer touches.", tag: "Most Popular" },
    { name: "Luxe", desc: "Elite imported materials and customized luxury.", tag: "Signature" },
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
            className={`relative w-full p-8 text-left rounded-2xl border-2 transition-all duration-300 ${
              current === pkg.name
                ? "border-[#C5A059] bg-[#C5A059]/5 shadow-lg"
                : "border-gray-50 hover:border-[#13503B] bg-white"
            }`}
          >
            {pkg.tag && (
              <span className="absolute top-4 right-6 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                {pkg.tag}
              </span>
            )}
            <span className="block font-black text-xl text-[#13503B] mb-1">{pkg.name}</span>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">{pkg.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

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
  });

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
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="relative">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="WhatsApp Number"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address (Optional)"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#C5A059] transition-all font-medium"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        
        <button
          onClick={() => onSubmit(form)}
          disabled={!form.name || !form.phone}
          className="w-full mt-6 bg-[#13503B] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-30 shadow-2xl shadow-[#13503B]/20 transition-all active:scale-95"
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

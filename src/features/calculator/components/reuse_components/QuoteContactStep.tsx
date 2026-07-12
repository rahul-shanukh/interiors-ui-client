import React, { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { type ZodIssue } from "zod";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { COUNTRY_CODES } from "../../utils/countryCodes";
import type { CustomerDetails } from "../../../../entities/quote/model/quote.types";
import { contactSchema } from "../../model/contact-validation.schema";
import { getRecaptchaToken } from "../../../../infrastructure/recaptcha/recaptcha";

const CITIES = [
  { name: "Bengaluru", coords: [12.9716, 77.5946] as [number, number] },
  { name: "Mumbai", coords: [19.076, 72.8777] as [number, number] },
  { name: "Delhi NCR", coords: [28.6139, 77.209] as [number, number] },
  { name: "Hyderabad", coords: [17.385, 78.4867] as [number, number] },
  { name: "Pune", coords: [18.5204, 73.8567] as [number, number] },
  { name: "Chennai", coords: [13.0827, 80.2707] as [number, number] },
  { name: "Kolkata", coords: [22.5726, 88.3639] as [number, number] },
];

interface QuoteContactStepProps {
  onSubmit: (data: CustomerDetails) => void;
  loading: boolean;
  headingText?: string;
  descriptionText?: string;
  submitButtonText?: string;
  minimal?: boolean;
}

interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface NominatimReverseResult {
  address?: {
    city?: string;
    town?: string;
    district?: string;
    county?: string;
    state?: string;
  };
}

export const QuoteContactStep: React.FC<QuoteContactStepProps> = ({
  onSubmit,
  loading,
  headingText = "Almost ready!",
  descriptionText = "Enter your details to reveal your personalized estimate.",
  submitButtonText = "Reveal My Estimate",
  minimal = false,
}) => {
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
  });

  // Local state to track specific field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaError, setCaptchaError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const isPopularCityMatch = CITIES.some(
    (c) => c.name.toLowerCase() === debouncedSearchQuery.toLowerCase().trim(),
  );
  const isDebouncing = searchQuery !== debouncedSearchQuery;

  const { data: suggestions = [], isFetching: isSearching } = useQuery<
    {
      displayName: string;
      shortName: string;
      coords: [number, number];
    }[]
  >({
    queryKey: ["citySuggestions", debouncedSearchQuery],
    queryFn: async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearchQuery)}&format=json&countrycodes=in&limit=5`,
        {
          headers: { "Accept-Language": "en" },
        },
      );
      if (!res.ok) throw new Error("Search failed");
      const data = (await res.json()) as NominatimSearchResult[];
      return data.map((item) => {
        const parts = item.display_name.split(",");
        const shortName = parts
          .slice(0, 2)
          .map((part) => part.trim())
          .join(", ");
        return {
          displayName: item.display_name,
          shortName: shortName,
          coords: [parseFloat(item.lat), parseFloat(item.lon)] as [
            number,
            number,
          ],
        };
      });
    },
    enabled: debouncedSearchQuery.trim().length >= 3 && !isPopularCityMatch,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: reverseGeocode } = useMutation<
    NominatimReverseResult,
    Error,
    { lat: number; lng: number }
  >({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`,
      );
      if (!res.ok) throw new Error("Reverse geocoding failed");
      return (await res.json()) as NominatimReverseResult;
    },
    onSuccess: (data, variables) => {
      if (data && data.address) {
        const address = data.address;
        const district =
          address.city ||
          address.town ||
          address.district ||
          address.county ||
          "";
        const state = address.state || "";
        const name =
          district && state
            ? `${district}, ${state}`
            : district || state || "Selected Location";
        selectCityRef.current(name, [variables.lat, variables.lng]);
      }
    },
  });

  const reverseGeocodeRef = useRef(reverseGeocode);
  useEffect(() => {
    reverseGeocodeRef.current = reverseGeocode;
  }, [reverseGeocode]);

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

    // Clear out spatial errors when a valid point is selected
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors.city;
      delete nextErrors.latitude;
      delete nextErrors.longitude;
      return nextErrors;
    });

    if (leafletMapRef.current) {
      leafletMapRef.current.setView(coords, 8, { animate: true });
      const predefinedMarker = markerMapRef.current[name];
      if (predefinedMarker) {
        if (customMarkerRef.current) {
          customMarkerRef.current.remove();
          customMarkerRef.current = null;
        }
        setTimeout(() => predefinedMarker.openPopup(), 300);
      } else {
        if (customMarkerRef.current) customMarkerRef.current.remove();

        const customIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border-2 border-[#13503B] transition-transform duration-300 hover:scale-110"><div class="w-2 h-2 rounded-full bg-[#C5A059]"></div></div>`,
          className: "custom-leaflet-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon: customIcon })
          .addTo(leafletMapRef.current)
          .bindPopup(
            `<div class="text-[#13503B] font-bold text-center">${name}</div>`,
            { closeButton: false, offset: [0, -5] },
          );

        customMarkerRef.current = marker;
        setTimeout(() => marker.openPopup(), 300);
      }
    }
  }

  const selectCityRef = useRef<
    (name: string, coords: [number, number]) => void
  >(() => { });
  useEffect(() => {
    selectCityRef.current = handleSelectCity;
  });

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

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      },
    ).addTo(map);

    const customIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border-2 border-[#13503B] transition-transform duration-300 hover:scale-110"><div class="w-2 h-2 rounded-full bg-[#C5A059]"></div></div>`,
      className: "custom-leaflet-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const markerMap: Record<string, L.Marker> = {};
    CITIES.forEach((city) => {
      const marker = L.marker(city.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div class="text-[#13503B] font-bold text-center">${city.name}</div>`,
          { closeButton: false, offset: [0, -5] },
        );
      marker.on("click", () => selectCityRef.current(city.name, city.coords));
      markerMap[city.name] = marker;
    });
    markerMapRef.current = markerMap;

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      reverseGeocodeRef.current({ lat, lng });
    });
  }, []);

  const handleFormSubmit = async () => {
    const parseResult = contactSchema.safeParse(form);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err: ZodIssue) => {
        const firstPath = err.path[0];
        if (typeof firstPath === "string") {
          fieldErrors[firstPath] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setCaptchaError("");
    setIsVerifying(true);

    try {
      const recaptchaToken = await getRecaptchaToken();
      onSubmit({
        ...form,
        phone: `${countryCode}${form.phone}`,
        recaptchaToken,
      });
    } catch (error) {
      console.error("reCAPTCHA token generation failed", error);
      setCaptchaError(
        "We could not verify this submission. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <div className="text-center animate-fadeIn max-w-sm mx-auto w-full">
      {!minimal && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5A059]/10 rounded-full mb-6 text-[#C5A059]">
          <Sparkles size={32} />
        </div>
      )}
      <h2 className={minimal ? "text-xl font-serif text-[#13503B] tracking-wide mb-1" : "text-3xl font-serif font-bold text-[#13503B] mb-3"}>
        {headingText}
      </h2>
      <p className={`text-gray-500 text-xs ${minimal ? "mb-6" : "mb-10"}`}>{descriptionText}</p>

      <div className="space-y-3">
        {/* Name Field Container */}
        <div>
          <div className="relative">
            <User
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${minimal ? "left-3 text-[#13503B]/50" : "left-4"}`}
            />
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full pr-4 outline-none transition-all font-medium text-gray-800 text-sm 
                ${minimal
                  ? "pl-10 py-3.5 bg-transparent border border-[#13503B]/30 rounded-sm text-[#13503B] placeholder:text-[#13503B]/40 focus:border-[#13503B] focus:ring-1 focus:ring-[#13503B]/20"
                  : "pl-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C5A059]"
                } 
                ${errors.name
                  ? (minimal ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-red-400 focus:border-red-500 ring-2 ring-red-100")
                  : ""
                }`}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          {errors.name && (
            <p className="text-left text-xs text-red-500 mt-1 font-bold pl-2">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone Field Container */}
        <div>
          <div className="relative flex items-center group">
            <Phone
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 transition-colors z-20 ${minimal ? "left-3 text-[#13503B]/50 group-focus-within:text-[#13503B]" : "text-gray-400 group-focus-within:text-[#C5A059] left-4"}`}
            />
            <div className={`absolute top-1/2 -translate-y-1/2 flex items-center z-20 border-r transition-colors ${minimal ? "left-9 border-[#13503B]/20 group-focus-within:border-[#13503B]/50" : "border-gray-200 group-focus-within:border-[#C5A059]/30 left-10"}`}>
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-1 bg-transparent border-none outline-none font-semibold text-gray-700 text-sm cursor-pointer select-none py-1 hover:text-[#13503B] transition-colors pr-1"
              >
                <span className={minimal ? "text-[#13503B]" : ""}>{countryCode}</span>
                <ChevronDown
                  size={12}
                  className={`transition-colors ${minimal ? "text-[#13503B]/50 group-hover:text-[#13503B]" : "text-gray-400 group-hover:text-gray-600"}`}
                />
              </button>
            </div>

            <input
              type="tel"
              placeholder="WhatsApp Number"
              className={`w-full pr-4 outline-none transition-all font-medium text-gray-800 text-sm 
                ${minimal
                  ? "pl-24 py-3.5 bg-transparent border border-[#13503B]/30 rounded-sm text-[#13503B] placeholder:text-[#13503B]/40 focus:border-[#13503B] focus:ring-1 focus:ring-[#13503B]/20"
                  : "pl-24 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C5A059] focus:shadow-md"
                } 
                ${errors.phone
                  ? (minimal ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-red-400 focus:border-red-500 ring-2 ring-red-100")
                  : ""
                }`}
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value.replace(/\D/g, ""))
              }
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
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left font-semibold text-xs text-gray-700 ${countryCode === c.code ? "bg-[#C5A059]/5 text-[#13503B]" : ""}`}
                  >
                    <span className="truncate max-w-[70%]">
                      {c.name} ({c.iso})
                    </span>
                    <span className="text-[#C5A059] font-black">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="text-left text-xs text-red-500 mt-1 font-bold pl-2">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email Field Container */}
        <div>
          <div className="relative">
            <Mail
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${minimal ? "left-3 text-[#13503B]/50" : "left-4"}`}
            />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full pr-4 outline-none transition-all font-medium text-gray-800 text-sm 
                ${minimal
                  ? "pl-10 py-3.5 bg-transparent border border-[#13503B]/30 rounded-sm text-[#13503B] placeholder:text-[#13503B]/40 focus:border-[#13503B] focus:ring-1 focus:ring-[#13503B]/20"
                  : "pl-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C5A059]"
                } 
                ${errors.email
                  ? (minimal ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-red-400 focus:border-red-500 ring-2 ring-red-100")
                  : ""
                }`}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-left text-xs text-red-500 mt-1 font-bold pl-2">
              {errors.email}
            </p>
          )}
        </div>

        {!minimal && (
          <div className="text-left mt-6">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#13503B] mb-2">
              <MapPin size={14} /> Select City
            </label>
          </div>
        )}

        {/* Search City Field Container */}
        <div className="relative mb-2 z-30">
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${minimal ? "left-3 text-[#13503B]/50" : "left-4"}`}
          />
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, Pune...)"
            className={`w-full pr-4 outline-none transition-all font-medium text-gray-800 text-sm 
              ${minimal
                ? "pl-10 py-3.5 bg-transparent border border-[#13503B]/30 rounded-sm text-[#13503B] placeholder:text-[#13503B]/40 focus:border-[#13503B] focus:ring-1 focus:ring-[#13503B]/20"
                : "pl-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C5A059]"
              } 
              ${errors.city
                ? (minimal ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-red-400 focus:border-red-500 ring-2 ring-red-100")
                : ""
              }`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && searchQuery.trim().length >= 3 && (
            <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {isSearching || isDebouncing ? (
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
                        <span className="font-semibold text-sm text-gray-800 truncate">
                          {c.shortName}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate">
                          {c.displayName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectCity(c.shortName, c.coords);
                          setShowSuggestions(false);
                        }}
                        className="bg-[#13503B] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0d3528] transition-colors cursor-pointer shrink-0"
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

        <div className="flex flex-wrap gap-2 justify-start mb-2">
          {CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleSelectCity(c.name, c.coords)}
              className={`px-3 py-1.5 transition-all duration-300 cursor-pointer ${minimal
                  ? `text-xs border-b border-transparent ${form.city === c.name ? "border-[#13503B] text-[#13503B] font-bold" : "text-gray-400 hover:text-gray-700"}`
                  : `rounded-full text-xs font-semibold ${form.city === c.name ? "bg-[#13503B] text-white shadow-md scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Map Container & Spatial Validation Alerts */}
        <div>
          <div
            className={`relative w-full h-44 overflow-hidden bg-gray-50 mb-2 ${minimal
                ? `rounded-sm border border-[#13503B]/30 ${errors.latitude || errors.longitude ? "border-red-400" : ""}`
                : `border rounded-2xl shadow-inner ${errors.latitude || errors.longitude ? "border-red-400 ring-2 ring-red-500/10" : "border-gray-100"}`
              }`}
          >
            <div
              ref={initMap}
              className="leaflet-map-node w-full h-full z-10"
            />
          </div>
          {(errors.city || errors.latitude || errors.longitude) && (
            <p className="text-left text-xs text-red-500 mb-4 font-bold pl-2">
              {errors.city ||
                errors.latitude ||
                "Please pin your precise site location directly on the map."}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleFormSubmit}
          disabled={loading || isVerifying}
          className={`w-full mt-6 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-500 cursor-pointer active:scale-95 disabled:opacity-30
            ${minimal
              ? "bg-[#13503B] hover:bg-[#0d3528] text-white font-serif tracking-[0.2em] rounded-sm shadow-none border border-transparent"
              : "bg-[#13503B] hover:bg-[#0d3528] text-white rounded-xl shadow-2xl shadow-[#13503B]/20"
            }`}
        >
          {loading || isVerifying ? "Processing..." : submitButtonText}
        </button>
        {captchaError && (
          <p className="text-xs text-red-500 mt-2 font-bold">{captchaError}</p>
        )}
        <p className="text-[10px] text-gray-400 mt-6">
          By clicking, you agree to receive a copy of your quote on WhatsApp and
          Email.
        </p>
        <p className="text-[10px] text-gray-400 mt-2">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-[#13503B] underline"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer"
            className="text-[#13503B] underline"
          >
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};

import type {
  QuoteRequest,
  CustomerDetails,
} from "../../../entities/quote/model/quote.types";

interface KitchenMapperInput {
  selectedLayoutId: string;
  selectedPackageId: string;
  measurements: Record<string, number>;
  customerDetails: CustomerDetails;
  layoutNameMap: Record<string, string>;
  packageNameMap: Record<string, string>;
}

export const mapKitchenUiToQuoteRequest = ({
  selectedLayoutId,
  selectedPackageId,
  measurements,
  customerDetails,
  layoutNameMap,
  packageNameMap,
}: KitchenMapperInput): QuoteRequest => {
  if (
    !customerDetails.state ||
    !customerDetails.country ||
    customerDetails.latitude == null ||
    customerDetails.longitude == null ||
    !customerDetails.recaptchaToken
  ) {
    throw new Error("Please select a complete location and verify your submission before continuing.");
  }

  const totalLength = Object.values(measurements).reduce(
    (sum, val) => sum + val,
    0,
  );

  const areaSizeString =
    Object.entries(measurements)
      .map(([key, val]) => `${key}: ${val}ft`)
      .join(", ") + ` (Total: ${totalLength}ft)`;

  return {
    calculatorType: "kitchen",
    // 1. Wrap in configuration
    configuration: {
      layout: `Kitchen (${layoutNameMap[selectedLayoutId] || "Custom"})`,
      builtupArea: areaSizeString,
      package: packageNameMap[selectedPackageId] || "Premium",
    },
    name: customerDetails.name,
    phone: customerDetails.phone,
    email: customerDetails.email || "",
    // 2. Wrap in location
    location: {
      city: customerDetails.city,
      state: customerDetails.state,
      country: customerDetails.country,
      latitude: customerDetails.latitude,
      longitude: customerDetails.longitude,
    },
    recaptchaToken: customerDetails.recaptchaToken,
  };
};

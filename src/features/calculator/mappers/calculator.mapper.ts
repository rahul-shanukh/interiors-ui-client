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
  const totalLength = Object.values(measurements).reduce(
    (sum, val) => sum + val,
    0,
  );

  const areaSizeString =
    Object.entries(measurements)
      .map(([key, val]) => `${key}: ${val}ft`)
      .join(", ") + ` (Total: ${totalLength}ft)`;

  return {
    bhkType: `Kitchen (${layoutNameMap[selectedLayoutId] || "Custom"})`,
    areaSize: areaSizeString,
    rooms: { living: 0, kitchen: 1, bedroom: 0, bathroom: 0, dining: 0 },
    package: packageNameMap[selectedPackageId] || "Premium",
    name: customerDetails.name,
    phone: customerDetails.phone, // Phone already contains country code from Step3Quote submission
    email: customerDetails.email || "", // Resolves string | undefined error
    city: customerDetails.city,
    latitude: customerDetails.latitude,
    longitude: customerDetails.longitude,
    recaptchaToken: customerDetails.recaptchaToken,
  };
};

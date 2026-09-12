//src/entities/quote/model/quote.types.ts
export interface RoomCounts {
  living: number;
  kitchen: number;
  bedroom: number;
  bathroom: number;
  dining: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  city: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  recaptchaToken?: string;
}

export interface CalculatorBuildData {
  bhkType: string | null;
  builtupArea: string | null;
  rooms: RoomCounts;
  packageLevel: string | null;
  customerDetails: CustomerDetails | null;
}

// This matches what the API expects
export interface QuoteRequest {
  calculatorType: "kitchen" | "full_home" | "wardrobe";
  configuration: {
    bhkType: string;
    builtupArea: string;
    rooms: RoomCounts;
    package: string;
  };
  name: string;
  phone: string;
  email: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  recaptchaToken?: string;
}

export interface QuoteResponse {
  success: boolean;
  message: string;
  quoteId?: string;
  estimatedPrice: number;
}

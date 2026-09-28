// src/entities/quote/model/quote.types.ts

import type { CreateQuoteRequest } from "../../../infrastructure/openapi/api";

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

// ---------------------------------------------------------------------------
// 1. DOMAIN CONFIGURATIONS (Strict shapes for each calculator)
// ---------------------------------------------------------------------------

type FullHomeRequest = Extract<
  CreateQuoteRequest,
  { calculatorType: "full_home" }
>;

export type RoomCounts = FullHomeRequest["configuration"]["rooms"];

export interface FullHomeConfiguration {
  bhkType: FullHomeRequest["configuration"]["bhkType"];
  builtupArea: string;
  rooms: RoomCounts;
  package: string;
}

export interface KitchenConfiguration {
  layout: string;
  builtupArea: string;
  package: string;
}

export interface WardrobeConfiguration {
  wardrobeType: string; // e.g., "SLIDING_DOOR", "HINGED_DOOR"
  length: string;
  height: string;
  package: string;
  dimensions: { widthFeet: number; heightFeet: number };
  materials: { core: string; finish: string };
  accessories: string[];
}

// ---------------------------------------------------------------------------
// 2. FRONTEND FORM STATE
// ---------------------------------------------------------------------------
// Uses Partial<> because form fields might be null/empty while the user is filling them out.

export type CalculatorBuildState =
  | {
      calculatorType: "full_home";
      configuration: Partial<FullHomeConfiguration>;
      customerDetails: CustomerDetails | null;
    }
  | {
      calculatorType: "kitchen";
      configuration: Partial<KitchenConfiguration>;
      customerDetails: CustomerDetails | null;
    }
  | {
      calculatorType: "wardrobe";
      configuration: Partial<WardrobeConfiguration>;
      customerDetails: CustomerDetails | null;
    };

// ---------------------------------------------------------------------------
// 3. BACKEND API PAYLOADS (Strict, complete data ready for submission)
// ---------------------------------------------------------------------------

export interface BaseQuoteRequest {
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

// Discriminated Union: TypeScript will enforce the correct configuration based on calculatorType
export type QuoteRequest = CreateQuoteRequest;
// | (BaseQuoteRequest & {
//     calculatorType: "full_home";
//     configuration: FullHomeConfiguration;
//   })
// | (BaseQuoteRequest & {
//     calculatorType: "kitchen";
//     configuration: KitchenConfiguration;
//   })
// | (BaseQuoteRequest & {
//     calculatorType: "wardrobe";
//     configuration: WardrobeConfiguration;
//   });

// ---------------------------------------------------------------------------
// 4. API RESPONSE
// ---------------------------------------------------------------------------

export interface QuoteResponse {
  success: boolean;
  message: string;
  quoteId?: string;
  estimatedPrice: number;
}

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
}

export interface CalculatorBuildData {
  bhkType: string | null;
  rooms: RoomCounts;
  packageLevel: string | null;
  customerDetails: CustomerDetails | null;
}

// This matches what the API expects
export interface QuoteRequest {
  bhkType: string;
  rooms: RoomCounts;
  package: string; // Map packageLevel to package
  name: string;
  phone: string;
  email: string;
}

export interface QuoteResponse {
  success: boolean;
  message: string;
  quoteId?: string;
  estimatedPrice: number;
}

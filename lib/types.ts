export type DestinationType = "ultra_island" | "luxury_5_star";

export type PackageType =
  | "room_only"
  | "bb"
  | "hb"
  | "fb"
  | "all_inclusive"
  | "special_package";

export interface PackageOption {
  type: PackageType;
  label: string;
  description?: string;
}

export interface Resort {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  destinationType: DestinationType;

  nightlyPriceLow: number;
  nightlyPriceHigh: number;
  currency: string;
  priceNotes: string;

  packageOptions: PackageOption[];

  peakSeasonMonths: number[];
  shoulderSeasonMonths: number[];
  offPeakSeasonMonths: number[];
  seasonNotes: string;

  flightTimeFromLondonHours: number;
  nearestAirport: string;
  transferType: "seaplane" | "boat" | "domestic_flight" | "car" | "mixed" | "helicopter";
  transferTimeMinutes: number;

  officialWebsite: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImageUrls: string[];

  bookingHint: string;
  tagline?: string;
  tags: string[];
  isAdultsOnly: boolean;
  minStayNights: number | null;
}
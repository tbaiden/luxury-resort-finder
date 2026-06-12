import { z } from "zod";
import resortsData from "../data/resorts.json";
import { Resort } from "./types";
import { ResortFilters } from "./filters";

const packageOptionSchema = z.object({
  type: z.string(),
  label: z.string(),
  description: z.string(),
});

const resortSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.string(),
  destinationType: z.enum(["ultra_island", "luxury_5_star"]),
  nightlyPriceLow: z.number(),
  nightlyPriceHigh: z.number(),
  currency: z.string().length(3),
  priceNotes: z.string(),
  packageOptions: z.array(packageOptionSchema),
  peakSeasonMonths: z.array(z.number().int().min(1).max(12)),
  shoulderSeasonMonths: z.array(z.number().int().min(1).max(12)),
  offPeakSeasonMonths: z.array(z.number().int().min(1).max(12)),
  seasonNotes: z.string(),
  flightTimeFromLondonHours: z.number(),
  nearestAirport: z.string(),
  transferType: z.enum(["seaplane", "helicopter", "car", "boat"]),
  transferTimeMinutes: z.number().int().nonnegative(),
  officialWebsite: z.string().url(),
  heroImageUrl: z.string(),
  galleryImageUrls: z.array(z.string()),
  bookingHint: z.string(),
  tags: z.array(z.string()),
  isAdultsOnly: z.boolean(),
  minStayNights: z.number().int().positive(),
});

const resortsSchema = z.array(resortSchema);

const resorts: Resort[] = resortsSchema.parse(resortsData) as Resort[];

export function getAllResorts(): Resort[] {
  return resorts;
}

export function getResortBySlug(slug: string): Resort | undefined {
  return resorts.find((resort) => resort.slug === slug);
}

export function filterResorts(filters: ResortFilters): Resort[] {
  const {
    budgetMin,
    budgetMax,
    month,
    flightTimeMax,
    destinationType,
    region,
  } = filters;

  return resorts.filter((resort) => {
    if (
      destinationType &&
      destinationType !== "all" &&
      resort.destinationType !== destinationType
    ) {
      return false;
    }

    if (
      typeof flightTimeMax === "number" &&
      resort.flightTimeFromLondonHours > flightTimeMax
    ) {
      return false;
    }

    if (
      region &&
      resort.region.toLowerCase() !== region.toLowerCase()
    ) {
      return false;
    }

    if (typeof budgetMin === "number" || typeof budgetMax === "number") {
      const low = resort.nightlyPriceLow;
      const high = resort.nightlyPriceHigh;

      if (typeof budgetMin === "number" && high < budgetMin) {
        return false;
      }

      if (typeof budgetMax === "number" && low > budgetMax) {
        return false;
      }
    }

    if (typeof month === "number") {
      const inKnownSeason =
        resort.peakSeasonMonths.includes(month) ||
        resort.shoulderSeasonMonths.includes(month) ||
        resort.offPeakSeasonMonths.includes(month);

      if (!inKnownSeason) {
        return false;
      }
    }

    return true;
  });
}
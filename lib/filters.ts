import { DestinationType } from "./types";

export interface ResortFilters {
  budgetMin?: number;
  budgetMax?: number;
  month?: number;
  flightTimeMax?: number;
  destinationType?: DestinationType | "all";
  region?: string;
}
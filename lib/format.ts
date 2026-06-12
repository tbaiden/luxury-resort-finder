export function formatDestinationType(type: string): string {
  if (type === "ultra_island") return "Ultra Island";
  if (type === "luxury_5_star") return "Luxury 5-Star";
  return type;
}
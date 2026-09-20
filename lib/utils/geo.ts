/**
 * Geo distance calculations and location utilities for FixLink
 */

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm === null || distanceKm === undefined) return "";
  if (distanceKm < 1) return "< 1 km away";
  return `${distanceKm.toFixed(1)} km away`;
}

export function matchesLocation(
  targetLocation: string,
  searchQuery?: string | null
): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;
  const cleanTarget = targetLocation.toLowerCase();
  const cleanQuery = searchQuery.toLowerCase().trim();
  return (
    cleanTarget.includes(cleanQuery) ||
    cleanQuery.includes(cleanTarget)
  );
}

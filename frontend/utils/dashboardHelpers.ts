export interface BackendPostcard {
  id: number;
  location: string;
  text: string;
  sentByMe: boolean;
  countryName?: string;
}

// Counts unique countries by thoroughly parsing and cleaning the locations
export function getUniqueCountriesCount(postcards: BackendPostcard[]): number {
  return new Set(
    postcards
      .map((card) => {
        // Choose countryName if it exists and is not empty, otherwise use location
        const rawLocation = (card.countryName && card.countryName.trim()) 
          ? card.countryName 
          : (card.location || "");

        // If the resulting string still contains a comma, extract the last part
        if (rawLocation.includes(",")) {
          const parts = rawLocation.split(",");
          return parts[parts.length - 1].trim().toLowerCase();
        }

        return rawLocation.trim().toLowerCase();
      })
      .filter(Boolean)
  ).size;
}

// Filters and sorts postcards by ID descending
export function filterAndSortPostcards(postcards: BackendPostcard[], sentByMe: boolean): BackendPostcard[] {
  return postcards
    .filter((card) => card.sentByMe === sentByMe)
    .sort((a, b) => b.id - a.id);
}
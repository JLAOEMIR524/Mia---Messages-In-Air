import { describe, it, expect } from "vitest";
import { getUniqueCountriesCount, filterAndSortPostcards } from "./dashboardHelpers";

describe("dashboardHelpers Unit Tests", () => {
  
  describe("getUniqueCountriesCount", () => {
    it("should handle mixed casing and trailing spaces", () => {
      const mockCards = [
        { id: 1, location: "Vienna", countryName: "Austria ", sentByMe: true, text: "" },
        { id: 2, location: "Salzburg", countryName: "AUSTRIA", sentByMe: false, text: "" },
        { id: 3, location: "Tokyo", countryName: "Japan", sentByMe: false, text: "" },
      ];
      
      // Austria and AUSTRIA should be treated as the same country
      expect(getUniqueCountriesCount(mockCards)).toBe(2);
    });

    it("should fallback to location if countryName is missing", () => {
      // Mock data where countryName is undefined
      const mockCards = [
        { id: 1, location: "Berlin", sentByMe: true, text: "" },
      ];
      expect(getUniqueCountriesCount(mockCards)).toBe(1);
    });

    it("should correctly handle location strings and country names for the same country", () => {
      // Mock data where some cards have commas and some don't, but all are Germany
      const mockCardsWithCommas = [
        { id: 1, location: "Berlin, Germany", countryName: "Germany", sentByMe: false, text: "" },
        { id: 2, location: "Munich, Germany", countryName: "", sentByMe: true, text: "" },
        { id: 3, location: "Germany", countryName: "Germany", sentByMe: false, text: "" },
      ];

      // Mock data where the backend cleanly provided the countryName property
      const mockCardsWithCleanCountries = [
        { id: 1, location: "Berlin", countryName: "Germany", sentByMe: false, text: "" },
        { id: 2, location: "Munich", countryName: "Germany", sentByMe: true, text: "" },
        { id: 3, location: "Frankfurt", countryName: "Germany", sentByMe: false, text: "" },
      ];

      // Both arrays must resolve to exactly 1 unique country (germany)
      expect(getUniqueCountriesCount(mockCardsWithCommas)).toBe(1);
      expect(getUniqueCountriesCount(mockCardsWithCleanCountries)).toBe(1);
    });
  });

  describe("filterAndSortPostcards", () => {
    it("should filter by sentByMe and sort descending by ID", () => {
      // Mock data with mixed IDs and sending states
      const mockCards = [
        { id: 1, sentByMe: true, location: "", text: "" },
        { id: 3, sentByMe: true, location: "", text: "" },
        { id: 2, sentByMe: false, location: "", text: "" },
      ];
      
      const sent = filterAndSortPostcards(mockCards, true);
      
      // Should only contain the 2 sent cards
      expect(sent).toHaveLength(2);
      // The postcard with the highest ID must be the first element
      expect(sent[0].id).toBe(3);
    });
  });
});
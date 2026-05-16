export interface AddressType {
  id: number;
  name: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

export interface LocationSuggestion {
  name: string;
  type: string;
}

export const fetchRandomAddressFromDB = async (): Promise<AddressType> => {
  const response = await fetch("http://localhost:3001/api/addresses/random");
  if (!response.ok) {
    throw new Error("Failed to fetch receiver address from database.");
  }
  return response.json();
};

export const searchLocationsFromDB = async (query: string): Promise<LocationSuggestion[]> => {
  if (!query.trim()) return [];
  
  const response = await fetch(`http://localhost:3001/api/locations?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch locations from database.");
  }
  return response.json();
};
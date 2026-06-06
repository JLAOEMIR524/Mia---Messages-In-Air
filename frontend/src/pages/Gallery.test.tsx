import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Gallery } from "./Gallery";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="mock-map">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: any) => <div data-testid="mock-marker">{children}</div>,
  Popup: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../helpers/invalidateMapSize", () => ({
  MapResizeHandler: () => null,
}));

const mockUseSession = vi.fn();
vi.mock("../api/auth-client", () => ({
  useSession: () => mockUseSession(),
}));

const VITE_API_URL = "http://localhost:3000";
vi.stubGlobal("import.meta", { env: { VITE_API_URL } });


const fetchSpy = vi.spyOn(window, "fetch");

describe("Gallery Component Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    
    mockUseSession.mockReturnValue({ 
      data: { user: { id: "user-123" } },
      loading: false 
    });
  });

  it("should show empty state text when API returns zero postcards", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ postcards: [] }),
    } as Response);

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No postcards found in this category/i)).toBeInTheDocument();
    });
  });

});
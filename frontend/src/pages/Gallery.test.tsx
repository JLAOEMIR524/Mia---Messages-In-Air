import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Gallery } from "./Gallery";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => (
    <div data-testid="mock-map">{children}</div>
  ),
  TileLayer: () => <div />,
  Marker: ({ children }: any) => (
    <div data-testid="mock-marker">{children}</div>
  ),
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
      loading: false,
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No postcards found in this category/i),
      ).toBeInTheDocument();
    });
  });

  it("should render postcards successfully when API returns data", async () => {
    const mockPostcards = [
      {
        id: 1,
        text: "Grüße aus Salzburg",
        location: "Salzburg",
        sentByMe: true,
        image: "/b.jpg",
        createdAt: "2026-06-01T10:00:00Z",
        receiverAddress: { name: "Julian" },
        greeting: "hiiiiii",
      },
      {
        id: 2,
        text: "Hallo vom Strand",
        location: "Mallorca",
        sentByMe: false,
        image: "/m.jpg",
        createdAt: "2026-06-02T10:00:00Z",
        receiverAddress: { name: "Sonja" },
        greeting: "Servus",
      },
    ];

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ postcards: mockPostcards }),
    } as Response);

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>,
    );

    const firstCardText = await screen.findByText("Grüße aus Salzburg");
    const secondCardText = screen.getByText("Hallo vom Strand");

    expect(firstCardText).toBeInTheDocument();
    expect(secondCardText).toBeInTheDocument();
  });

  it("should filter and show only sent postcards when clicking the sent filter button", async () => {
    const user = userEvent.setup();
    const mockPostcards = [
      {
        id: 1,
        text: "Grüße aus Salzburg",
        location: "Salzburg",
        sentByMe: true,
        image: "/b.jpg",
        createdAt: "2026-06-01T10:00:00Z",
        receiverAddress: { name: "Julian" },
        greeting: "hiiiiii",
      },
      {
        id: 2,
        text: "Hallo vom Strand",
        location: "Mallorca",
        sentByMe: false,
        image: "/m.jpg",
        createdAt: "2026-06-02T10:00:00Z",
        receiverAddress: { name: "Sonja" },
        greeting: "Servus",
      },
    ];

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ postcards: mockPostcards }),
    } as Response);

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>,
    );

    await screen.findByText("Grüße aus Salzburg");

    const sentButton = screen.getByRole("button", {
      name: /show sent Postcards/i,
    });
    await act(async () => {
      await user.click(sentButton);
    });

    expect(screen.getByText("Grüße aus Salzburg")).toBeInTheDocument();
    expect(screen.queryByText("Hallo vom Strand")).not.toBeInTheDocument();
  });

  it("should flip the postcard when user focuses it and presses Spacebar", async () => {
    const user = userEvent.setup();
    const mockPostcards = [
      {
        id: 1,
        text: "Grüße aus Salzburg",
        location: "Salzburg",
        sentByMe: true,
        image: "/b.jpg",
        createdAt: "2026-06-01T10:00:00Z",
        receiverAddress: { name: "Julian" },
        greeting: "hiiiiii",
      },
    ];
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ postcards: mockPostcards }),
    } as Response);

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>,
    );

    const cardWrapper = await screen.findByRole("button", {
      name: /Postcard to Julian/i,
    });

    expect(cardWrapper).toHaveAttribute("aria-pressed", "false");

    await act(async () => {
      cardWrapper.focus();
      await user.keyboard(" ");
    });

    expect(cardWrapper).toHaveAttribute("aria-pressed", "true");
  });
});

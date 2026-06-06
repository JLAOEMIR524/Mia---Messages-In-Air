import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Details } from "./Details";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

const mockAnalysis = {
  ratings: { length: 4, badWords: 5, capitalization: 3, punctuation: 2 },
  questFulfillment: [
    { name: "Write a friendly greeting", score: 5 },
    { name: "Use 3 adjectives", score: 4 }
  ],
  xpCalculation: { baseXP: 20, questXP: 10, totalXP: 150, percentage: 85 },
};

describe("Details Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("should render all analysis details correctly from router state", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { analysis: mockAnalysis },
      key: "test-key",
      pathname: "/details",
      search: "",
      hash: "",
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText("Length of Postcard: 4/5")).toBeInTheDocument();
    expect(screen.getByText("No bad words: 5/5")).toBeInTheDocument();
    expect(screen.getByText("Capitalisation: 3/5")).toBeInTheDocument();
    expect(screen.getByText("Punctuation: 2/5")).toBeInTheDocument();

    expect(screen.getByText("Quest Fulfillment:")).toBeInTheDocument();
    expect(screen.getByText("Write a friendly greeting: 5/5")).toBeInTheDocument();
    expect(screen.getByText("Use 3 adjectives: 4/5")).toBeInTheDocument();

    expect(screen.getByText("+150 XP")).toBeInTheDocument();
  });

  it("should load data from sessionStorage on page reload", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: "test-key",
      pathname: "/details",
      search: "",
      hash: "",
    });

    sessionStorage.setItem("last_postcard_analysis", JSON.stringify(mockAnalysis));

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText("Length of Postcard: 4/5")).toBeInTheDocument();
    expect(screen.getByText("+150 XP")).toBeInTheDocument();
  });

  it("should gracefully render fallback default values (0/5) when no data is available", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: "test-key",
      pathname: "/details",
      search: "",
      hash: "",
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText("Length of Postcard: 0/5")).toBeInTheDocument();
    expect(screen.getByText("No bad words: 0/5")).toBeInTheDocument();
    
    expect(screen.queryByText("Quest Fulfillment:")).toBeNull();
    expect(screen.getByText("+0 XP")).toBeInTheDocument();
  });

  it("should clear sessionStorage when the continue button is clicked", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { analysis: mockAnalysis },
      key: "test-key",
      pathname: "/details",
      search: "",
      hash: "",
    });

    sessionStorage.setItem("last_postcard_analysis", JSON.stringify(mockAnalysis));

    const mockLocation = {
      ...window.location,
      href: "",
    };
    vi.stubGlobal("location", mockLocation);

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    const continueBtn = screen.getByRole("link", { name: /back to dashboard/i });
    fireEvent.click(continueBtn);

    expect(sessionStorage.getItem("last_postcard_analysis")).toBeNull();
    expect(mockLocation.href).toBe("/dashboard");
  });
});
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Send } from "./Send";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
  };
});

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="mock-confetti">Confetti Area</div>,
}));

const mockAnalysis = {
  ratings: { length: 5, badWords: 0, capitalization: 5, punctuation: 5 },
  questFulfillment: [],
  xpCalculation: { baseXP: 20, questXP: 10, totalXP: 120, percentage: 80 },
};

describe("Send Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("should render data from router state and save it to sessionStorage", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { analysis: mockAnalysis },
      key: "test-key",
      pathname: "/send",
      search: "",
      hash: "",
    });

    render(
      <MemoryRouter>
        <Send />
      </MemoryRouter>
    );

    expect(screen.getByText("+120 XP")).toBeInTheDocument();

    const xpDisplay = screen.getByLabelText("You scored 4 of 5 Stars.");
    expect(xpDisplay).toBeInTheDocument();
    
    const sessionBackup = sessionStorage.getItem("last_postcard_analysis");
    expect(sessionBackup).not.toBeNull();
    expect(JSON.parse(sessionBackup!)).toEqual(mockAnalysis);
  });

  it("should fall back to sessionStorage if router state is empty (e.g. page reload)", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: "test-key",
      pathname: "/send",
      search: "",
      hash: "",
    });

    sessionStorage.setItem("last_postcard_analysis", JSON.stringify(mockAnalysis));

    render(
      <MemoryRouter>
        <Send />
      </MemoryRouter>
    );

    expect(screen.getByText("+120 XP")).toBeInTheDocument();
    expect(screen.getByLabelText("You scored 4 of 5 Stars.")).toBeInTheDocument();
  });

  it("should clear sessionStorage and navigate to dashboard on continue", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { analysis: mockAnalysis },
      key: "test-key",
      pathname: "/send",
      search: "",
      hash: "",
    });

    render(
      <MemoryRouter>
        <Send />
      </MemoryRouter>
    );

    const continueBtn = screen.getByRole("link", { name: /back to dashboard/i });
    fireEvent.click(continueBtn);

    expect(sessionStorage.getItem("last_postcard_analysis")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to details with current analysis state on clicking 'View Details'", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { analysis: mockAnalysis },
      key: "test-key",
      pathname: "/send",
      search: "",
      hash: "",
    });

    render(
      <MemoryRouter>
        <Send />
      </MemoryRouter>
    );

    const detailsBtn = screen.getByRole("link", { name: /view details/i });
    fireEvent.click(detailsBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/details", {
      state: { fromMessage: true, analysis: mockAnalysis },
    });
  });
});
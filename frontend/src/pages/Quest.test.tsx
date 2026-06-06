import { render, screen} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Quest } from "./Quest";
import { MemoryRouter } from "react-router-dom";

const VITE_API_URL = "http://localhost:3000";
vi.stubGlobal("import.meta", { env: { VITE_API_URL } });

const fetchSpy = vi.spyOn(window, "fetch");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Quest Component Tests", () => {
  const mockQuests = {
    quests: [
      { id: 1, title: "Quest Eins", description: "Beschreibung 1", xp: 100 },
      { id: 2, title: "Quest Zwei", description: "Beschreibung 2", xp: 200 },
      { id: 3, title: "Quest Drei", description: "Beschreibung 3", xp: 300 },
      { id: 4, title: "Quest Vier", description: "Beschreibung 4", xp: 400 },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    
    vi.spyOn(Math, "random").mockReturnValue(0.1); 
  });

  it("should show validation warning and disable button until a quest is selected", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuests,
    } as Response);

    render(
      <MemoryRouter>
        <Quest />
      </MemoryRouter>
    );

    expect(await screen.findByText("Choose Your Creative Quest ✨")).toBeInTheDocument();

    expect(screen.getByText(/Please select a quest to continue/i)).toBeInTheDocument();
    
    const continueButton = screen.getByRole("button", { name: /Continue to Editor/i });
    expect(continueButton).toBeDisabled();
  });
});
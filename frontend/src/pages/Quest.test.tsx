import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Quest } from "./Quest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Choose Your Creative Quest ✨"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Please select a quest to continue/i),
    ).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: /Continue to Editor/i,
    });
    expect(continueButton).toBeDisabled();
  });

  it("should enable the continue button and remove the warning when an alternative quest is clicked", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuests,
    } as Response);

    render(
      <MemoryRouter>
        <Quest />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Choose Your Creative Quest ✨"),
    ).toBeInTheDocument();

    const alternativeQuest = screen.getByText("Quest Zwei");
    await userEvent.click(alternativeQuest);

    expect(
      screen.queryByText(/Please select a quest to continue/i),
    ).not.toBeInTheDocument();

    const continueLink = screen.getByRole("link", {
      name: /Continue to Editor/i,
    });
    expect(continueLink).toBeInTheDocument();
  });

  it("should save the selected quest to localStorage when clicking the continue link", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuests,
    } as Response);

    render(
      <MemoryRouter>
        <Quest />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Choose Your Creative Quest ✨"),
    ).toBeInTheDocument();

    const alternativeQuest = screen.getByText("Quest Drei");
    await userEvent.click(alternativeQuest);

    const continueLink = screen.getByRole("link", {
      name: /Continue to Editor/i,
    });
    await userEvent.click(continueLink);

    const storedQuest = JSON.parse(
      localStorage.getItem("selectedQuest") || "{}",
    );
    expect(storedQuest.title).toBe("Quest Drei");
    expect(storedQuest.xp).toBe(300);
  });

  it("should navigate directly to the editor when the continue action inside QuestCard is clicked", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuests,
    } as Response);

    render(
      <MemoryRouter>
        <Quest />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Choose Your Creative Quest ✨"),
    ).toBeInTheDocument();

    const chooseThisQuestButton = screen.getByRole("link", {
      name: /Choose This Quest/i,
    });

    await userEvent.click(chooseThisQuestButton);

    const storedQuest = JSON.parse(
      localStorage.getItem("selectedQuest") || "{}",
    );
    expect(storedQuest.title).toBe("Quest Eins");

    expect(mockNavigate).toHaveBeenCalledWith("/editor", {
      state: { fromQuest: true },
    });
  });

  it("should change the active quest when the reload button is clicked", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuests,
    } as Response);

    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValue(0.9);

    render(
      <MemoryRouter>
        <Quest />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { level: 2, name: "Quest Vier" }),
    ).toBeInTheDocument();

    const reloadButton = screen.getByRole("button", {
      name: /Reload Quest/i,
    });

    await userEvent.click(reloadButton);

    const activeMainQuest = screen.queryByRole("heading", {
      level: 2,
      name: "Quest Vier",
    });
    expect(activeMainQuest).not.toBeInTheDocument();
  });
});

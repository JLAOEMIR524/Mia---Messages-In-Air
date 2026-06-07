import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Profile } from "./Profile";
import { MemoryRouter } from "react-router-dom";

const mockUseSession = vi.fn();
vi.mock("../api/auth-client", () => ({
  useSession: () => mockUseSession(),
}));

const VITE_API_URL = "http://localhost:3000";
vi.stubGlobal("import.meta", { env: { VITE_API_URL } });

const fetchSpy = vi.spyOn(window, "fetch");

describe("Profile Component Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();

    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "user-123",
          firstName: "Sonja",
          lastName: "Schorn",
          email: "fhs52320@fh-salzburg.at",
          createdAt: "2026-06-06T12:00:00Z",
        },
      },
      loading: false,
    });
  });

  it("should show an error message when the profile data fetching fails", async () => {
    //Prevemts react from logging the erros in this case and at the end resets this behaviour
    const consoleSpy = vi.spyOn(console, "error");

    fetchSpy.mockRejectedValueOnce(new Error("Database disconnected"));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /Profile data could not be loaded. Please try again later./i,
        ),
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("should successfully render user stats, stickers, and completed quests", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sentCount: 5, xp: 1200 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stickers: [
            {
              id: 1,
              name: "First Postcard",
              stickerSrc: "/sticker_1.png",
              xpAmount: 100,
              isLocked: false,
              description: "Sent 1st card",
              iconSrc: "/icon_1.png",
            },
            {
              id: 2,
              name: "World Traveler",
              stickerSrc: "/sticker_2.png",
              xpAmount: 4000,
              isLocked: true,
              description: "Unlock at 4000 XP",
              iconSrc: "/icon_2.png",
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quests: [
            {
              id: 10,
              title: "Welcome Quest",
              description: "Log in for the first time",
              earnedXp: 50,
            },
          ],
        }),
      } as Response);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Sonja Schorn")).toBeInTheDocument();
    expect(screen.getByText(/fhs52320@fh-salzburg\.at/i)).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: /Unlocked Sticker: First Postcard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Locked Sticker: World Traveler/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Welcome Quest")).toBeInTheDocument();
    expect(
      screen.getByText("Log in for the first time (+50 XP)"),
    ).toBeInTheDocument();
  });

  it("should show empty state text when user has no completed quests", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sentCount: 0, xp: 0 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stickers: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ quests: [] }),
      } as Response);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/You haven't completed any quests yet/i),
    ).toBeInTheDocument();
  });

  it("should correctly separate stickers into unlocked and locked sections based on their status", async () => {
    const mockStickers = [
      {
        id: 1,
        name: "Frog",
        stickerSrc: "/sticker_1.png",
        xpAmount: 100,
        isLocked: false,
        description: "Unlocked",
        iconSrc: "/icon_1.png",
      },
      {
        id: 2,
        name: "Rainbow",
        stickerSrc: "/sticker_2.png",
        xpAmount: 500,
        isLocked: true,
        description: "Locked",
        iconSrc: "/icon_2.png",
      },
    ];

    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sentCount: 1, xp: 100 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stickers: mockStickers }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ quests: [] }),
      } as Response);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    await screen.findByText("Your Profile 👤");

    const unlockedSticker = screen.getByRole("img", {
      name: /Unlocked Sticker: Frog. Worth 100 XP./i,
    });
    expect(unlockedSticker).toBeInTheDocument();

    const lockedSticker = screen.getByRole("button", {
      name: /Locked Sticker: Rainbow. Requires 500 XP./i,
    });
    expect(lockedSticker).toBeInTheDocument();
  });
});

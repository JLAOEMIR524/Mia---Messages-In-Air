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
    fetchSpy.mockRejectedValueOnce(new Error("Database disconnected"));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Profile data could not be loaded. Please try again later./i)
      ).toBeInTheDocument();
    });
  });
});
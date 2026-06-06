import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ForgotPassword } from "./ForgotPassword";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { authClient } from "../api/auth-client";
import "@testing-library/jest-dom";

type ResetPasswordResult = Awaited<ReturnType<typeof authClient.requestPasswordReset>>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/auth-client", () => ({
  authClient: {
    requestPasswordReset: vi.fn(),
  },
}));

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render initial form fields and content correctly", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /forgot your password\?/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to log in/i })).toBeInTheDocument();
  });

  it("should call requestPasswordReset and redirect to login on success", async () => {
    vi.mocked(authClient.requestPasswordReset).mockResolvedValue({
      error: null,
    } as ResetPasswordResult);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    
    fireEvent.click(screen.getByRole("button", { name: /send link/i }));

    expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
      email: "fhs52320@fh-salzburg.ac.at",
      redirectTo: expect.stringContaining("/reset-password"),
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("should display a generic error message when the API request fails", async () => {
    vi.mocked(authClient.requestPasswordReset).mockResolvedValue({
      error: { message: "User not found", status: 404 },
    } as unknown as ResetPasswordResult);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "unknown@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send link/i }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent("User not found");
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should display a special error message when daily email limit (Rate Limit 429) is reached", async () => {
    vi.mocked(authClient.requestPasswordReset).mockResolvedValue({
      error: { message: "Too many requests", status: 429 },
    } as unknown as ResetPasswordResult);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    fireEvent.click(screen.getByRole("button", { name: /send link/i }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(
      "Our email system is out of tokens for today. We cannot send reset links right now. Please try again tomorrow!"
    );
  });
});

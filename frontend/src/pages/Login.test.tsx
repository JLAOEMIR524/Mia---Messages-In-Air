import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { signIn, useSession } from "../api/auth-client";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/auth-client", () => ({
  useSession: vi.fn(),
  signIn: {
    email: vi.fn(),
    passkey: vi.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "PublicKeyCredential", {
      writable: true,
      value: {
        isConditionalMediationAvailable: vi.fn().mockResolvedValue(false),
      },
    });

    vi.mocked(useSession).mockReturnValue({ data: null } as any);
  });

  it("should render initial form fields correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /welcome back!/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should trigger redirect if user session already exists", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: "Mia" } },
    } as any);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should call Better Auth with correct credentials on submit", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/e-mail:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(signIn.email).toHaveBeenCalledWith(
      { email: "test@example.com", password: "password123" },
      expect.any(Object),
    );
  });

  it("should render error message when backend API returns an error", async () => {
    vi.mocked(signIn.email).mockImplementation((_credentials, options) => {
      if (options?.onError) {
        options.onError({
          error: { message: "Invalid credentials" },
        } as any);
      }
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/e-mail:/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent("Error: Invalid credentials");

    expect(screen.getByLabelText(/password/i)).toHaveValue("");
  });
});

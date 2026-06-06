import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Register } from "./Register";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { signUp, useSession } from "../api/auth-client";
import "@testing-library/jest-dom";

type SignUpEmailArgs = Parameters<typeof signUp.email>;

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
  signUp: {
    email: vi.fn(),
  },
}));

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    
    vi.mocked(useSession).mockReturnValue({ data: null } as ReturnType<typeof useSession>);
  });

  it("should render all input fields and the submit button", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/firstname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lastname:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("should display an error if passwords do not match without calling the API", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: "Sonja" } });
    fireEvent.change(screen.getByLabelText(/lastname:/i), { target: { value: "Schorn" } });
    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "secure123" } });
    fireEvent.change(screen.getByLabelText(/confirm password:/i), { target: { value: "different123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent("Error: Passwords don't match");

    expect(signUp.email).not.toHaveBeenCalled();
  });

  it("should display an error if the password is flagged as leaked/pwned", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ isPwned: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: "Sonja" } });
    fireEvent.change(screen.getByLabelText(/lastname:/i), { target: { value: "Schorn" } });
    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirm password:/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockFetch).toHaveBeenCalled();

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent("Error: Unsafe password - try choosing something sophisticated");

    expect(signUp.email).not.toHaveBeenCalled();
  });

  it("should call signUp.email with combined names if validation and security check pass", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ isPwned: false }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: "Sonja" } });
    fireEvent.change(screen.getByLabelText(/lastname:/i), { target: { value: "Schorn" } });
    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password:/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(signUp.email).toHaveBeenCalledWith(
        {
          email: "fhs52320@fh-salzburg.ac.at",
          password: "password123",
          name: "Sonja Schorn",
          firstName: "Sonja",
          lastName: "Schorn",
        },
        expect.any(Object)
      );
    });
  });

  it("should call signUp.email and redirect to dashboard on success", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ isPwned: false }),
    });
    vi.stubGlobal("fetch", mockFetch);

    vi.mocked(signUp.email).mockImplementation((_credentials, options) => {
      const successOptions = options as Extract<SignUpEmailArgs[1], { onSuccess?: unknown }>;
      if (successOptions?.onSuccess) {
        successOptions.onSuccess({} as unknown as Parameters<NonNullable<typeof successOptions.onSuccess>>[0]);
      }
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: "Sonja" } });
    fireEvent.change(screen.getByLabelText(/lastname:/i), { target: { value: "Schorn" } });
    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "fhs52320@fh-salzburg.ac.at" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password:/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(signUp.email).toHaveBeenCalledWith(
        {
          email: "fhs52320@fh-salzburg.ac.at",
          password: "password123",
          name: "Sonja Schorn",
          firstName: "Sonja",
          lastName: "Schorn",
        },
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    }, { timeout: 200 }); 
  });

  it("should display backend error message if signUp.email fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ isPwned: false }),
    });
    vi.stubGlobal("fetch", mockFetch);

    vi.mocked(signUp.email).mockImplementation((_credentials, options) => {
      const errorOptions = options as Extract<SignUpEmailArgs[1], { onError?: unknown }>;
      if (errorOptions?.onError) {
        const mockErrorContext = {
          error: { message: "Email already in use" }
        } as unknown as Parameters<NonNullable<typeof errorOptions.onError>>[0];
        
        errorOptions.onError(mockErrorContext);
      }
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: "Sonja" } });
    fireEvent.change(screen.getByLabelText(/lastname:/i), { target: { value: "Schorn" } });
    fireEvent.change(screen.getByLabelText(/e-mail:/i), { target: { value: "alreadyused@fh-salzburg.ac.at" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password:/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent("Error: Email already in use");
  });
});
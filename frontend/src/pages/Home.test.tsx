import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

const mockSetPreviewOpen = vi.fn();
let currentPreviewOpen = false;

vi.mock("../hooks/usePreview", () => ({
  usePreview: () => ({
    previewOpen: currentPreviewOpen,
    setPreviewOpen: mockSetPreviewOpen,
  }),
}));

vi.mock("../components/NavbarTop", () => ({
  NavBarTop: () => <nav data-testid="navbar-top">NavBar</nav>,
}));

vi.mock("../components/Preview", () => ({
  Preview: ({
    children,
    isOpen,
    title,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    title: string;
  }) =>
    isOpen ? (
      <div data-testid="preview-modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentPreviewOpen = false;
  });

  it("should render the home landing page structure with call-to-actions", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /mia messages in air/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("A postcard to a stranger.")).toBeInTheDocument();

    const startButton = screen.getByRole("link", { name: /start now/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveAttribute("href", "/register");
  });

  it("should trigger setPreviewOpen(true) when clicking 'Find out more'", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const findOutMoreButton = screen.getByRole("button", {
      name: /find out more/i,
    });

    fireEvent.click(findOutMoreButton);

    expect(mockSetPreviewOpen).toHaveBeenCalledWith(true);
  });

  it("should apply the inert attribute to main when preview is open", () => {
    currentPreviewOpen = true;

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const mainElement = screen.getByRole("main");

    expect(mainElement).toHaveAttribute("inert");

    expect(screen.getByTestId("preview-modal")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The Idea Behind Mia" }),
    ).toBeInTheDocument();
  });
});

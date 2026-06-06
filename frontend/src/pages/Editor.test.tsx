import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { Editor } from "./Editor";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUsePostcard = {
  elements: [],
  selectedId: null,
  selectElement: vi.fn(),
  addElementDrop: vi.fn(),
  updateElement: vi.fn(),
  deleteSelected: vi.fn(),
  upSelected: vi.fn(),
  downSelected: vi.fn(),
  addElementRandom: vi.fn(),
  moveSelected: vi.fn(),
};

vi.mock("../hooks/usePostcard", () => ({
  usePostcard: () => mockUsePostcard,
}));

vi.mock("../components/Canvas", () => ({
  Canvas: () => <div data-testid="mock-canvas">Canvas Area</div>,
}));

vi.mock("../components/ImageSelector", () => ({
  PhotoUploader: () => <div>PhotoUploader Mock</div>,
}));

vi.mock("../components/StickerSelector", () => ({
  StickerSelector: () => <div>StickerSelector Mock</div>,
}));

describe("Editor Component - Initial State & UI Tabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePostcard.elements = [];
    mockUsePostcard.selectedId = null;
  });

  it("should disable the continue button and show a warning when the canvas is empty", () => {
    render(
      <MemoryRouter>
        <Editor />
      </MemoryRouter>
    );

    const warning = screen.getByText(/Please add some content to your postcard to continue/i);
    expect(warning).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /Continue to Message/i });
    expect(continueButton).toBeDisabled();
  });

  it("should switch tabs correctly when clicking on menu buttons", async () => {
    render(
      <MemoryRouter>
        <Editor />
      </MemoryRouter>
    );

    const photoTabButton = screen.getByRole("button", { name: /open photo picker/i });
    const stickerTabButton = screen.getByRole("button", { name: /open sticker picker/i });
    const colorTabButton = screen.getByRole("button", { name: /open Backgroundcolor picker/i });

    expect(photoTabButton).toHaveClass("button--selected");
    expect(stickerTabButton).not.toHaveClass("button--selected");

    await userEvent.click(stickerTabButton);
    expect(stickerTabButton).toHaveClass("button--selected");
    expect(photoTabButton).not.toHaveClass("button--selected");

    await userEvent.click(colorTabButton);
    expect(colorTabButton).toHaveClass("button--selected");
    expect(stickerTabButton).not.toHaveClass("button--selected");
  });
});
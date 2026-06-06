import { fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { Editor } from "./Editor";
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import React from "react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockUsePostcard: {
  elements: unknown[];
  selectedId: string | null;
  selectElement: Mock<(id: string | null) => void>;
  addElementDrop: Mock<(element: unknown, x: number, y: number) => void>;
  updateElement: Mock<(id: string, data: unknown) => void>;
  deleteSelected: Mock<() => void>;
  upSelected: Mock<() => void>;
  downSelected: Mock<() => void>;
  addElementRandom: Mock<(element: unknown, x: number, y: number) => void>;
  moveSelected: Mock<(x: number, y: number) => void>;
} = {
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

const mockStage = {
  toDataURL: vi.fn().mockReturnValue("data:image/webp;base64,fake_canvas_data"),
};

vi.mock("../components/Canvas", () => ({
  Canvas: ({ stageRef }: { stageRef?: React.MutableRefObject<unknown> }) => {
    if (stageRef) {
      stageRef.current = mockStage;
    }
    return <div data-testid="mock-canvas">Canvas Area</div>;
  },
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
      </MemoryRouter>,
    );

    const warning = screen.getByText(
      /Please add some content to your postcard to continue/i,
    );
    expect(warning).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: /Continue to Message/i,
    });
    expect(continueButton).toBeDisabled();
  });

  it("should switch tabs correctly when clicking on menu buttons", async () => {
    render(
      <MemoryRouter>
        <Editor />
      </MemoryRouter>,
    );

    const photoTabButton = screen.getByRole("button", {
      name: /open photo picker/i,
    });
    const stickerTabButton = screen.getByRole("button", {
      name: /open sticker picker/i,
    });
    const colorTabButton = screen.getByRole("button", {
      name: /open Backgroundcolor picker/i,
    });

    expect(photoTabButton).toHaveClass("button--selected");
    expect(stickerTabButton).not.toHaveClass("button--selected");

    await userEvent.click(stickerTabButton);
    expect(stickerTabButton).toHaveClass("button--selected");
    expect(photoTabButton).not.toHaveClass("button--selected");

    await userEvent.click(colorTabButton);
    expect(colorTabButton).toHaveClass("button--selected");
    expect(stickerTabButton).not.toHaveClass("button--selected");
  });

  describe("Editor Component - Advanced Logic & Interactivity", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockUsePostcard.elements = [
        { id: "element-1", type: "image", src: "test.jpg" },
      ];
      mockUsePostcard.selectedId = "element-1";
      localStorage.clear();
    });

    describe("Moderation API & Navigation", () => {
      let useRefSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        vi.useFakeTimers();
        useRefSpy = vi.spyOn(React, "useRef").mockImplementation(() => {
          return { current: mockStage };
        });
      });

      afterEach(() => {
        useRefSpy.mockRestore();
        vi.useRealTimers();
      });

      it("should successfully export canvas, pass moderation, and navigate to /message", async () => {
        const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValueOnce({
          json: async () => ({ ok: true }),
        } as Response);

        render(
          <MemoryRouter>
            <Editor />
          </MemoryRouter>,
        );

        const continueButton = screen.getByRole("link", {
          name: /Continue to Message/i,
        });

        fireEvent.click(continueButton);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(150);
        });

        expect(localStorage.getItem("card")).toBe(
          "data:image/webp;base64,fake_canvas_data",
        );
        expect(screen.getByText("Sending Image ...")).toBeInTheDocument();

        await act(async () => {
          await vi.advanceTimersByTimeAsync(4000);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/message", {
          state: { fromEditor: true },
        });
        expect(fetchSpy).toHaveBeenCalled();
      });

      it("should block navigation and display an alert message if moderation fails", async () => {
        vi.spyOn(window, "fetch").mockResolvedValueOnce({
          json: async () => ({ ok: false }),
        } as Response);

        render(
          <MemoryRouter>
            <Editor />
          </MemoryRouter>,
        );

        const continueButton = screen.getByRole("link", {
          name: /Continue to Message/i,
        });

        fireEvent.click(continueButton);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(4150);
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        const errorMsg = screen.getByRole("alert");
        expect(errorMsg).toHaveTextContent(/Inappropriate content detected/i);
      });
    });

    describe("Keyboard Shortcuts", () => {
      it("should trigger deleteSelected when Backspace or Delete is pressed", async () => {
        render(
          <MemoryRouter>
            <Editor />
          </MemoryRouter>,
        );

        await userEvent.keyboard("{Delete}");
        expect(mockUsePostcard.deleteSelected).toHaveBeenCalledTimes(1);

        await userEvent.keyboard("{Backspace}");
        expect(mockUsePostcard.deleteSelected).toHaveBeenCalledTimes(2);
      });

      it("should trigger layer reordering functions when pressing F or B", async () => {
        render(
          <MemoryRouter>
            <Editor />
          </MemoryRouter>,
        );

        await userEvent.keyboard("f");
        expect(mockUsePostcard.upSelected).toHaveBeenCalledTimes(1);

        await userEvent.keyboard("b");
        expect(mockUsePostcard.downSelected).toHaveBeenCalledTimes(1);
      });

      it("should clear selection when Escape is pressed", async () => {
        render(
          <MemoryRouter>
            <Editor />
          </MemoryRouter>,
        );

        await userEvent.keyboard("{Escape}");
        expect(mockUsePostcard.selectElement).toHaveBeenCalledWith(null);
      });
    });
  });
});

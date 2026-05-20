import Konva from "konva";
import { Canvas } from "../components/Canvas";
import { PhotoUploader } from "../components/ImageSelector";
import { usePostcard } from "../hooks/usePostcard";
import { useRef, useCallback, useState, useEffect } from "react";
import { useResponsiveScale } from "../hooks/useResponsiveScale";
import { StickerSelector } from "../components/StickerSelector";
import { Step } from "../components/Step";
import { Link, useNavigate } from "react-router";
import type {
  AvailableSticker,
  DragPayload,
  UploadedImage,
} from "../types/CanvasTypes";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const MOVE_STEP_LARGE = 15;
const MOVE_STEP_SMALL = 5;

export function Editor() {
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [currentBar, setBar] = useState<string>("image");
  const [focus, setFocus] = useState<string | null>(null);
  const { scale } = useResponsiveScale(CANVAS_WIDTH);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const navigate = useNavigate();
  const presetColors = [
    "#fcffa7",
    "#ffe0bc",
    "#ffd0d0",
    "#f1d1f0",
    "#d2d4ff",
    "#d6ffc5",
    "#c5fff3",
  ];

  const {
    elements,
    selectedId,
    selectElement,
    addElementDrop,
    updateElement,
    deleteSelected,
    upSelected,
    downSelected,
    addElementRandom,
    moveSelected,
  } = usePostcard();

  const handleExport = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const stage = stageRef.current;
      if (!stage) {
        reject("No stage Detected");
        return;
      }

      selectElement(null);

      // Timeout allows Konva to clear selection borders before converting canvas to raw data URL
      setTimeout(() => {
        try {
          const dataUrl = stage.toDataURL({
            pixelRatio: 2,
            mimeType: "image/jpeg",
          });

          localStorage.setItem("card", dataUrl);
          resolve(dataUrl);
        } catch (e) {
          console.error("Error:", e);
          reject(e);
        }
      }, 150);
    });
  }, [selectElement]);

  async function handlePageSwitch() {
    setModerationError(null);
    setModerationLoading(true);

    try {
      const dataUrl = await handleExport();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ image: dataUrl }),
      });

      const result = await res.json();

      if (result.ok) {
        navigate("/message", { state: { fromEditor: true } });
      } else {
        setModerationError(
          "Inappropriate content detected. Please modify it and try again.",
        );
      }
    } catch (e) {
      console.error("Moderation error: ", e);
      setModerationError("Something went wrong. Please try again.");
    } finally {
      setModerationLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP_SMALL;

      switch (e.key) {
        case "Delete":
        case "Backspace":
          deleteSelected();
          break;

        case "f":
        case "F":
          upSelected();
          break;

        case "b":
        case "B":
          downSelected();
          break;

        case "Escape":
          e.preventDefault();
          selectElement(null);
          break;

        case "ArrowUp":
          if (!selectedId) break;
          e.preventDefault();
          moveSelected(0, -step);
          break;

        case "ArrowDown":
          if (!selectedId) break;
          e.preventDefault();
          moveSelected(0, step);
          break;

        case "ArrowLeft":
          if (!selectedId) break;
          e.preventDefault();
          moveSelected(-step, 0);
          break;

        case "ArrowRight":
          if (!selectedId) break;
          e.preventDefault();
          moveSelected(step, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    deleteSelected,
    upSelected,
    downSelected,
    selectElement,
    moveSelected,
    selectedId,
  ]);

  useEffect(() => {
    document.title = "Mia | Editor";
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageClick = (image: UploadedImage) => {
    const maxW = 250;
    const scale = image.width > maxW ? maxW / image.width : 1;

    const payload: DragPayload = {
      type: "image",
      src: image.src,
      width: image.width * scale,
      height: image.height * scale,
    };

    addElementRandom(payload, CANVAS_WIDTH, CANVAS_HEIGHT);
    focusCanvs();
  };

  const handleStickerClick = (sticker: AvailableSticker, size: number) => {
    const payload: DragPayload = {
      type: "sticker",
      src: sticker.src,
      width: size,
      height: size,
    };

    addElementRandom(payload, CANVAS_WIDTH, CANVAS_HEIGHT);
    focusCanvs();
  };

  // Automatically transfers keyboard focus back to the canvas element for immediate navigation controls
  const focusCanvs = useCallback(() => {
    const container = stageRef.current?.container();
    if (!container) return;

    if (container.tabIndex < 0) {
      container.tabIndex = 0;
    }

    container.focus({ preventScroll: true });
  }, []);

  const IsPostcardEmpty = elements.length === 0;

  return (
    <main className="imageEditor">
      <Link
        to="#"
        onClick={handleBack}
        className="StepBack left"
        aria-label="go one step back"
      >
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>
      <Step currentStep={2} />
      <h1 className="text-l">Create Your Photo Collage 📸</h1>
      <p>Upload pictures and use stickers to create a unique collage.</p>
      <div className="imageEditor">
        <div className="barSelector">
          <button
            className={`button button--image ${"image" === currentBar ? "button--selected" : ""}`}
            onClick={() => setBar("image")}
            onMouseOver={() => setFocus("image")}
            onMouseOut={() => setFocus(null)}
            aria-label="open photo picker"
          >
            <img
              src={`./icons/image${"image" === currentBar || focus === "image" ? "_b" : "_w"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Photos
          </button>
          <button
            className={`button button--image ${"sticker" === currentBar ? "button--selected" : ""}`}
            onClick={() => setBar("sticker")}
            onMouseOver={() => setFocus("sticker")}
            onMouseOut={() => setFocus(null)}
            aria-label="open sticker picker"
          >
            <img
              src={`./icons/star_shine${"sticker" === currentBar || focus === "sticker" ? "_b" : "_w"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Stickers
          </button>
          <button
            className={`button button--image ${"color" === currentBar ? "button--selected" : ""}`}
            onClick={() => setBar("color")}
            onMouseOver={() => setFocus("color")}
            onMouseOut={() => setFocus(null)}
            aria-label="open color picker"
          >
            <img
              src={`./icons/colors${"color" === currentBar || focus === "color" ? "_blue" : "_white"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Colour
          </button>
        </div>
        <div style={{ display: currentBar === "image" ? "block" : "none" }}>
          <PhotoUploader onImageClick={handleImageClick} />
        </div>
        <div style={{ display: currentBar === "sticker" ? "block" : "none" }}>
          <StickerSelector onImageClick={handleStickerClick} />
        </div>
        <div style={{ display: currentBar === "color" ? "block" : "none" }}>
          <div className="galleryContainer">
            <div
              className="gallery"
              role="radiogroup"
              aria-label="Background colors"
              onKeyDown={(e) => {
                const focusable =
                  e.currentTarget.querySelectorAll("button, input");
                const index = Array.from(focusable).indexOf(
                  document.activeElement as HTMLButtonElement,
                );

                if (e.key === "ArrowRight") {
                  const next = (index + 1) % focusable.length;
                  (focusable[next] as HTMLElement).focus();
                } else if (e.key === "ArrowLeft") {
                  const prev =
                    (index - 1 + focusable.length) % focusable.length;
                  (focusable[prev] as HTMLElement).focus();
                }
              }}
            >
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="barItem"
                  aria-label={`Colour ${color}`}
                  style={{
                    backgroundColor: color,
                    borderRadius: "12px",
                    border:
                      color === bgColor
                        ? "3px solid var(--color-primary)"
                        : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setBgColor(color)}
                />
              ))}
              <div style={{ width: "20px" }} aria-hidden="true" />
            </div>
            <div className="barItem" style={{ position: "relative" }}>
              <label className="addButton" style={{ cursor: "pointer" }}>
                <img src="./icons/colorize.svg" alt="" aria-hidden="true" />
                <p aria-hidden="true">Custom</p>
                <input
                  type="color"
                  aria-label="Choose own colour"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </label>
            </div>
          </div>
        </div>
        {currentBar === "text" && <p>Text</p>}
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={selectElement}
          onUpdate={updateElement}
          onDrop={addElementDrop}
          stageRef={stageRef}
          scale={scale}
          backgroundColor={bgColor}
        />
        <div
          className="editActions"
          style={{ marginBottom: IsPostcardEmpty ? "0" : "1.5rem" }}
        >
          <button
            className={`button button--image ${"up" === currentBar ? "button--selected" : ""}`}
            onMouseOver={() => setFocus("up")}
            onMouseOut={() => setFocus(null)}
            onClick={upSelected}
            disabled={!selectedId}
            aria-label="move selected item forward"
          >
            <img
              src={`./icons/flip_front${selectedId ? (focus === "up" ? "" : "_w") : "_b"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Front
          </button>
          <button
            className={`button button--image ${"down" === currentBar ? "button--selected" : ""}`}
            onMouseOver={() => setFocus("down")}
            onMouseOut={() => setFocus(null)}
            onClick={downSelected}
            disabled={!selectedId}
            aria-label="move selected item backwards"
          >
            <img
              src={`./icons/flip_back${selectedId ? (focus === "down" ? "" : "_w") : "_b"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Back
          </button>
          <button
            className={`button button--image  ${"delete" === currentBar ? "button--selected" : ""}`}
            onMouseOver={() => setFocus("delete")}
            onMouseOut={() => setFocus(null)}
            onClick={deleteSelected}
            disabled={!selectedId}
            aria-label="delete selected item"
          >
            <img
              src={`./icons/trash${selectedId ? (focus === "delete" ? "" : "_w") : "_b"}.svg`}
              alt=""
              aria-hidden="true"
            />
            Delete
          </button>
        </div>
        <div aria-live="polite">
          {IsPostcardEmpty && (
            <p id="empty-canvas-warning" className="warning fixed">
              Please add some content to your postcard to continue.
            </p>
          )}
          {moderationError && (
            <p className="warning fixed" role="alert">
              {moderationError}
            </p>
          )}
        </div>
      </div>
      <div style={{ cursor: "pointer", marginTop: "2.5rem" }}>
        {IsPostcardEmpty ? (
          <button
            className="button button--image"
            disabled
            aria-describedby="empty-canvas-warning"
          >
            Continue to Message
            <span className="icon-span"></span>
          </button>
        ) : (
          <Link
            to="/message"
            className="button button--image"
            onClick={async (e) => {
              e.preventDefault();
              await handlePageSwitch();
            }}
          >
            {moderationLoading ? "Checking image..." : "Continue to Message"}
            <span className="icon-span"></span>
          </Link>
        )}
      </div>
    </main>
  );
}

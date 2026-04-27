import Konva from "konva";
import { Canvas } from "../components/Canvas";
import { PhotoUploader } from "../components/ImageSelector";
import { usePostcard } from "../hooks/usePostcard";
import { useRef, useCallback, useState, useEffect } from "react";
import { useResponsiveScale } from "../hooks/useResponsiveScale";
import { StickerSelector } from "../components/StickerSelector";
import { Step } from "../components/Step";
import { Link, useNavigate } from "react-router";

const CANVAS_WIDTH = 800;

export function Editor() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [currentBar, setBar] = useState<string>("image");
  const [focus, setFocus] = useState<string | null>(null);
  const { scale } = useResponsiveScale(CANVAS_WIDTH);
  const navigate = useNavigate();

  const {
    elements,
    selectedId,
    selectElement,
    addElementDrop,
    updateElement,
    deleteSelected,
    upSelected,
    downSelected,
  } = usePostcard();

  const handleExport = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const stage = stageRef.current;
      if (!stage) {
        reject("No stage Detected");
        return;
      }

      selectElement(null);

      setTimeout(() => {
        try {
          const dataUrl = stage.toDataURL({
            pixelRatio: 2,
            mimeType: "image/png",
          });

          localStorage.setItem("card", dataUrl);
          resolve();
        } catch (e) {
          console.error("Error:", e);
          reject(e);
        }
      }, 150);
    });
  }, [selectElement]);

  async function handlePageSwitch() {
    await handleExport();
    navigate("/message", { state: { fromEditor: true } });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
      if (e.key === "ArrowUp") {
        upSelected();
      }
      if (e.key === "ArrowDown") {
        downSelected();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        selectElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, upSelected, downSelected, selectElement]);

  useEffect(() => {
    document.title = "Mia | Editor";
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const IsPostcardEmpty = elements.length === 0;

  return (
    <main className="imageEditor">
      <Link to="#" onClick={handleBack} className="StepBack left">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
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
          >
            <img
              src={`./icons/image${"image" === currentBar || focus === "image" ? "_b" : "_w"}.svg`}
              alt="image icon"
              aria-hidden="true"
            />
            Photos
          </button>
          <button
            className={`button button--image ${"sticker" === currentBar ? "button--selected" : ""}`}
            onClick={() => setBar("sticker")}
            onMouseOver={() => setFocus("sticker")}
            onMouseOut={() => setFocus(null)}
          >
            <img
              src={`./icons/star_shine${"sticker" === currentBar || focus === "sticker" ? "_b" : "_w"}.svg`}
              alt="image icon"
              aria-hidden="true"
            />
            Stickers
          </button>
        </div>
        <div style={{ display: currentBar === "image" ? "block" : "none" }}>
          <PhotoUploader />
        </div>
        <div style={{ display: currentBar === "sticker" ? "block" : "none" }}>
          <StickerSelector />
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
          >
            <img
              src={`./icons/flip_front${selectedId ? (focus === "up" ? "" : "_w") : "_b"}.svg`}
              alt="flip front icon"
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
          >
            <img
              src={`./icons/flip_back${selectedId ? (focus === "down" ? "" : "_w") : "_b"}.svg`}
              alt="flip front icon"
              aria-hidden="true"
            />
            Back
          </button>
          <button
            className={`button button--image  ${"delete" === currentBar ? "button--selected" : ""}`}
            onMouseOver={() => setFocus("delete")}
            onMouseOut={() => setFocus(null)}
            onClick={deleteSelected}
            disabled={!selectedId}
          >
            <img
              src={`./icons/trash${selectedId ? (focus === "delete" ? "" : "_w") : "_b"}.svg`}
              alt="delete icon icon"
              aria-hidden="true"
            />
            Delete
          </button>
        </div>
        {IsPostcardEmpty && (
          <p className="warning fixed">
            Please add some content to your postcard to continue.
          </p>
        )}
      </div>
      <div
        style={{ cursor: "pointer", marginTop: "2.5rem" }}
        onClick={() => !IsPostcardEmpty && handlePageSwitch()}
      >
        {IsPostcardEmpty ? (
          <button className="button button--image" disabled>
            Continue to Editor
            <span className="icon-span"></span>
          </button>
        ) : (
          <Link
            to="/editor"
            state={{ fromQuest: true }}
            className="button button--image"
          >
            Continue to Message
            <span className="icon-span"></span>
          </Link>
        )}
      </div>
    </main>
  );
}

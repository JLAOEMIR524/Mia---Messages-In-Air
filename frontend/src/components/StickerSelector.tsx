import { useCallback, useEffect, useRef, useState } from "react";
import type { AvailableSticker, DragPayload } from "../types/CanvasTypes";

interface Stickers {
  id: number;
  name: string;
  stickerSrc: string;
  xpAmount: number;
  isLocked: boolean;
  description: string;
  iconSrc: string;
}

const STICKER_SIZE = 70;

export function StickerSelector({
  onImageClick,
}: {
  onImageClick: (src: AvailableSticker, size: number) => void;
}) {
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [stickers, setStickers] = useState<Stickers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch stream filtering out locked assets
  useEffect(() => {
    const fetchAvailableStickers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stickers`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) throw new Error("Failed to fetch stickers");

        const data = await response.json();

        const unlockedOnly = (data.stickers || []).filter(
          (sticker: Stickers) => !sticker.isLocked,
        );

        setStickers(unlockedOnly);
      } catch (err) {
        console.error("Error loading selector stickers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableStickers();
  }, []);

  // Serializes runtime payload for HTML5 dataTransfer channel
  const handleDragStart = async (
    e: React.DragEvent<HTMLImageElement>,
    src: string,
  ) => {
    const payload: DragPayload = {
      type: "sticker",
      src: src,
      width: STICKER_SIZE,
      height: STICKER_SIZE,
    };

    e.dataTransfer.setData(
      "application/postcard-element",
      JSON.stringify(payload),
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  // Keyboard navigation controller
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (stickers.length === 0) return;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight": {
          e.preventDefault();
          const next = (index + 1) % stickers.length;
          setFocusIndex(next);
          itemsRef.current[next]?.focus();
          break;
        }

        case "ArrowDown":
        case "ArrowLeft": {
          e.preventDefault();
          const previous = (index - 1 + stickers.length) % stickers.length;
          setFocusIndex(previous);
          itemsRef.current[previous]?.focus();
          break;
        }

        case "Enter":
        case " ":
          e.preventDefault();
          onImageClick(
            { src: stickers[index].stickerSrc, label: stickers[index].name },
            STICKER_SIZE,
          );
          break;
      }
    },
    [onImageClick, stickers],
  );

  if (loading) {
    return <div className="galleryContainer">Loading stickers...</div>;
  }

  if (stickers.length === 0) {
    return <div className="galleryContainer">No stickers unlocked yet.</div>;
  }
  return (
    <div
      className="galleryContainer"
      aria-label="Choose Sticker"
      role="listbox"
    >
      <div className="gallery">
        {stickers.map((sticker, i) => (
          <div
            className="barItem image"
            key={sticker.id}
            role="option"
            aria-selected={focusIndex === i}
            tabIndex={focusIndex === i ? 0 : -1} // Renders sequential focus to selected index only
            ref={(element) => {
              itemsRef.current[i] = element;
            }}
            onFocus={() => setFocusIndex(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            <img
              src={sticker.stickerSrc}
              alt={sticker.description}
              onDragStart={(e) => handleDragStart(e, sticker.stickerSrc)}
              onClick={() =>
                onImageClick(
                  { src: sticker.stickerSrc, label: sticker.name },
                  STICKER_SIZE,
                )
              }
              draggable
            />
          </div>
        ))}
      </div>
    </div>
  );
}

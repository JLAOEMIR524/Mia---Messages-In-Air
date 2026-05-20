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

const STICKERS = [
  { src: "./stickers/4.avif", label: "icon car" },
  { src: "./stickers/2.avif", label: "icon plane" },
  { src: "./stickers/11.avif", label: "icon four leaf clover" },
  { src: "./stickers/5.avif", label: "icon books" },
  { src: "./stickers/8.avif", label: "icon computer" },
  { src: "./stickers/15.avif", label: "icon hamburger" },
  { src: "./stickers/21.avif", label: "icon joy" },
  { src: "./stickers/34.avif", label: "icon soccer" },
  { src: "./stickers/13.avif", label: "icon frog" },
  { src: "./stickers/35.avif", label: "icon star" },
  { src: "./stickers/18.avif", label: "icon heart" },
];

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

  useEffect(() => {
    const fetchAvailableStickers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stickers`, {
          credentials: "include",
        });
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight": {
          e.preventDefault();
          const next = (index + 1) % STICKERS.length;
          setFocusIndex(next);
          itemsRef.current[next]?.focus();
          break;
        }

        case "ArrowDown":
        case "ArrowLeft": {
          e.preventDefault();
          const previous = (index - 1) % STICKERS.length;
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
            tabIndex={focusIndex === i ? 0 : -1}
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

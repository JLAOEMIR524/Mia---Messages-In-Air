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

  // Fetch unlocked stickers + one next locked teaser sticker
  useEffect(() => {
    const fetchStickersWithTeaser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stickers`,
          { credentials: "include" },
        );
        if (!response.ok) throw new Error("Failed to fetch stickers");

        const data = await response.json();
        const allStickers: Stickers[] = data.stickers || [];

        const unlocked = allStickers.filter((s) => !s.isLocked);
        const lockedSortedByXp = allStickers
          .filter((s) => s.isLocked)
          .sort((a, b) => a.xpAmount - b.xpAmount);

        const nextLockedTeaser = lockedSortedByXp[0];

        if (nextLockedTeaser) {
          setStickers([...unlocked, nextLockedTeaser]);
        } else {
          setStickers(unlocked);
        }
      } catch (err) {
        console.error("Error loading selector stickers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStickersWithTeaser();
  }, []);

  const handleDragStart = async (
    e: React.DragEvent<HTMLImageElement>,
    sticker: Stickers,
  ) => {
    if (sticker.isLocked) {
      e.preventDefault();
      return;
    }

    const payload: DragPayload = {
      type: "sticker",
      src: sticker.stickerSrc,
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
          if (!stickers[index].isLocked) {
            onImageClick(
              { src: stickers[index].stickerSrc, label: stickers[index].name },
              STICKER_SIZE,
            );
          }
          break;
      }
    },
    [onImageClick, stickers],
  );

  if (loading) {
    return <div className="galleryContainer">Loading stickers...</div>;
  }

  if (stickers.length === 0) {
    return <div className="galleryContainer">No stickers found.</div>;
  }

  return (
    <div
      className="galleryContainer"
      aria-label="Choose Sticker"
      role="listbox"
    >
      <div className="gallery">
        {stickers.map((sticker, i) => {
          const ariaLabel = sticker.isLocked
            ? `Next Reward: ${sticker.name} - Locked. Requires ${sticker.xpAmount} XP.`
            : sticker.description;

          return (
            <div
              className={`barItem image sticker-container ${sticker.isLocked ? "sticker--locked" : "sticker--unlocked"}`}
              key={sticker.id}
              role="option"
              aria-selected={focusIndex === i}
              aria-label={ariaLabel}
              tabIndex={focusIndex === i ? 0 : -1}
              ref={(element) => {
                itemsRef.current[i] = element;
              }}
              onFocus={() => setFocusIndex(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{ position: "relative" }}
            >
              <img
                src={sticker.stickerSrc}
                alt=""
                aria-hidden="true"
                className="sticker-img"
                onDragStart={(e) => handleDragStart(e, sticker)}
                onClick={() => {
                  if (!sticker.isLocked) {
                    onImageClick(
                      { src: sticker.stickerSrc, label: sticker.name },
                      STICKER_SIZE,
                    );
                  }
                }}
                draggable={!sticker.isLocked}
              />

              {sticker.isLocked && (
                <div className="sticker-locked-overlay">
                  <img
                    src="./icons/lock.svg"
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: "30px",
                      height: "30px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                  <span className="sticker-xp-badge">
                    {sticker.xpAmount} XP
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

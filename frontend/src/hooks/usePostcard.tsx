import { useCallback, useState } from "react";
import type {
  CanvasElement,
  DragPayload,
  ImageElement,
  StickerElement,
} from "../types/CanvasTypes";
import { v4 as uuidv4 } from "uuid";

export function usePostcard() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sets the active element target identifier
  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  // Instantiates canvas assets and computes origin offset coordinates to center elements on drop
  const addElementDrop = useCallback(
    (payload: DragPayload, x: number, y: number) => {
      if (payload.type === "sticker") {
        const sticker: StickerElement = {
          id: uuidv4(),
          type: "sticker",
          x: x - payload.width / 2,
          y: y - payload.height / 2,
          src: payload.src,
          width: payload.width,
          height: payload.height,
          rotation: 0,
        };
        setElements((prev) => [...prev, sticker]);
        setSelectedId(sticker.id);
      }

      if (payload.type === "image") {
        const image: ImageElement = {
          id: uuidv4(),
          type: "image",
          x: x - payload.width / 2,
          y: y - payload.height / 2,
          src: payload.src,
          width: payload.width,
          height: payload.height,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        };
        setElements((prev) => [...prev, image]);
        setSelectedId(image.id);
      }
    },
    [],
  );

  // Updates properties of an active node while preserving immutable state references
  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? ({ ...elem, ...updates } as CanvasElement) : elem,
        ),
      );
    },
    [],
  );

  // Filters out the targeted element ID from the state array stream
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((elem) => elem.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  // Swaps indices forward to increment render layers (z-index) on the canvas
  const upSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const index = prev.findIndex((element) => element.id === selectedId);
      if (index < 0 || index >= prev.length - 1) return prev;
      const newArray = [...prev];
      [newArray[index + 1], newArray[index]] = [
        newArray[index],
        newArray[index + 1],
      ];
      return newArray;
    });
  }, [selectedId]);

  // Swaps indices backward to decrement render layers (z-index) on the canvas
  const downSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const index = prev.findIndex((element) => element.id === selectedId);
      if (index <= 0) return prev;
      const newArray = [...prev];
      [newArray[index - 1], newArray[index]] = [
        newArray[index],
        newArray[index - 1],
      ];
      return newArray;
    });
  }, [selectedId]);

  // Computes randomized bounded coordinates within canvas viewport limits
  const addElementRandom = useCallback(
    (payload: DragPayload, canvasWidth: number, canvasHeight: number) => {
      const x =
        Math.random() * (canvasWidth - payload.width) + payload.width / 2;
      const y =
        Math.random() * (canvasHeight - payload.height) + payload.height / 2;
      addElementDrop(payload, x, y);
    },
    [addElementDrop],
  );

  // Applies directional offset deltas to target structural layout coordinates
  const moveSelected = useCallback(
    (moveDirectionx: number, moveDirectiony: number) => {
      if (!selectElement) return;
      setElements((prev) =>
        prev.map((element) =>
          element.id === selectedId
            ? ({
                ...element,
                x: element.x + moveDirectionx,
                y: element.y + moveDirectiony,
              } as CanvasElement)
            : element,
        ),
      );
    },
    [selectedId, selectElement],
  );

  return {
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
  };
}

export interface ImageElement {
    id: string;
    type: "image";
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
}

export interface StickerElement {
    id: string;
    type: "sticker";
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    rotation: number;
}

export type CanvasElement = ImageElement | StickerElement;

export interface DragPayload {
    type: "sticker" | "image";
    src: string;
    width: number;
    height: number;
}

export interface UploadedImage {
  src: string;
  width: number;
  height: number;
}

export interface AvailableSticker {
    src: string,
    label: string
}
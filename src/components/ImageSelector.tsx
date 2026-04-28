import React, { useCallback, useRef, useState, type ChangeEvent } from "react";
import type { DragPayload, UploadedImage } from "../types/CanvasTypes";

const MAX_PLACEHOLDER_SLOTS = 1;

function loadImage(src: string): Promise<UploadedImage> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
    img.src = src;
  });
}

export function PhotoUploader({onImageClick}: {onImageClick: (src: UploadedImage) => void}) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const uploaded = await loadImage(reader.result);
          setImages((prev) => {
            return [...prev, uploaded];
          });
          onImageClick(uploaded); //Sets the uploaded picture directly on the canvas
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleDragStart = async (
    e: React.DragEvent<HTMLImageElement>,
    image: UploadedImage,
  ) => {
    const maxW = 250;
    const scale = image.width > maxW ? maxW / image.width : 1;

    const payload: DragPayload = {
      type: "image",
      src: image.src,
      width: image.width * scale,
      height: image.height * scale,
    };

    e.dataTransfer.setData(
      "application/postcard-element",
      JSON.stringify(payload),
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch(e.key){
        case "ArrowUp":
        case "ArrowRight":
            e.preventDefault();
            const next = (index + 1) % images.length;
            setFocusIndex(next);
            itemsRef.current[next]?.focus();
            break;

        case "ArrowDown":
        case "ArrowLeft":
            e.preventDefault();
            const previous = (index - 1 + images.length) % images.length;
            setFocusIndex(previous);
            itemsRef.current[previous]?.focus();
            break;
        case "Enter":
        case " ":
            e.preventDefault();
            onImageClick(images[index]);
            break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          handleRemove(index);
          break;
    }
  }, [onImageClick, images]);

  const emptySlots = Math.max(0, MAX_PLACEHOLDER_SLOTS - images.length);

  return (
    <div 
      className="galleryContainer" 
      aria-label="Image Upload/Uploaded Images" 
      role="list"
    >
      <div className="gallery">
        {images.map((image, i) => (
          <div 
            className="barItem image" 
            key={i}
            tabIndex={focusIndex === i ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            <img
              src={image.src}
              alt={"Uploaded Image"}
              role="listitem"
              draggable
              onDragStart={(e) => handleDragStart(e, image)}
              onClick={() => onImageClick(image)}
            />
            <button onClick={() => handleRemove(i)} className="button--delete" aria-hidden="true" tabIndex={-1}>
              X
            </button>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            className="barItem placeholder"
            key={`empty-${i}`}
            onClick={handlePlaceholderClick}
          >
            <p>Add Images</p>
          </div>
        ))}
        <button className="addButton" onClick={handlePlaceholderClick}>
          <img src="./icons/add_circle.svg" alt="" aria-hidden="true" />
          <p>Add image</p>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </div>
  );
}

import { useRef, useState, type ChangeEvent } from "react";
import type { DragPayload } from "../types/CanvasTypes";

const MAX_SLOTS = 5;

function getImageSize(src: string): Promise<{w: number; h: number}> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({w: img.naturalWidth, h: img. naturalHeight});
        img.src = src;
    });
}

export function PhotoUploader() {
    const [images, setImage] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        files.forEach((file) => {
            if(images.length >= MAX_SLOTS) return;

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setImage((prev) => {
                        if (prev.length >= MAX_SLOTS) return prev;
                        return [...prev, reader.result as string];
                    })
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const handleDragStart = async (e: React.DragEvent<HTMLImageElement>, src: string) => {
        const { w, h } = await getImageSize(src);

        const maxW = 250;
        const scale = w > maxW ? maxW / w : 1;

        const payload: DragPayload = {
            type: "image",
            src, 
            width: w * scale, height: h * scale,
        };

        e.dataTransfer.setData("application/postcard-element", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleRemove = (index: number) => {
        setImage(prev => prev.filter((_, i) => i !== index));
    };

    const handlePlaceholderClick = () => {
        fileInputRef.current?.click();
    }

    const emptySlots = Math.max(0, MAX_SLOTS - images.length);

    return (
        <div className="galleryContainer">
            <div className="gallery">
                {images.map((src, i) => (
                    <div className="barItem image" key={i}>
                        <img 
                            src={src}
                            alt={"Uploaded Image"} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, src)}
                        />
                    </div>
                    //Functionality for image removal still missing
                ))}
                {Array.from({length: emptySlots }).map((_, i) => (
                    <div 
                        className="barItem placeholder" 
                        key={`empty-${i}`} 
                        onClick={handlePlaceholderClick}
                    >
                        <p>Add Images</p>
                    </div>
                ))}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                style={{ display: 'none' }}
            />
            <button
                className="addButton"
                onClick={handlePlaceholderClick}
                disabled={images.length >= MAX_SLOTS}
                >
                <img src="./icons/Plus.svg" alt="" aria-hidden="true" />
                <p>Add image</p>
            </button>
        </div>
    )
}
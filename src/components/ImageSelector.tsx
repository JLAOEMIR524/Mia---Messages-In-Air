import { useRef, useState, type ChangeEvent } from "react";
import type { DragPayload } from "../types/CanvasTypes";

const MAX_SLOTS = 5;

interface UploadedImage {
    src: string;
    width: number;
    height: number;
}

function loadImage(src: string): Promise<UploadedImage> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({src, width: img.naturalWidth, height: img. naturalHeight});
        img.src = src;
    });
}

export function PhotoUploader() {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        files.forEach((file) => {
            if(images.length >= MAX_SLOTS) return;

            const reader = new FileReader();
            reader.onload = async () => {
                if (typeof reader.result === "string") {
                    const uploaded = await loadImage(reader.result)
                    setImages((prev) => {
                        if (prev.length >= MAX_SLOTS) return prev;
                        return [...prev, uploaded];
                    })
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const handleDragStart = async (e: React.DragEvent<HTMLImageElement>, image: UploadedImage) => {

        const maxW = 250;
        const scale = image.width > maxW ? maxW / image.width : 1;

        const payload: DragPayload = {
            type: "image",
            src: image.src, 
            width: image.width * scale, height: image.height * scale,
        };

        e.dataTransfer.setData("application/postcard-element", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleRemove = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePlaceholderClick = () => {
        fileInputRef.current?.click();
    }

    const emptySlots = Math.max(0, MAX_SLOTS - images.length);

    return (
        <div className="galleryContainer">
            <div className="gallery">
                {images.map((image, i) => (
                    <div className="barItem image" key={i}>
                        <img 
                            src={image.src}
                            alt={"Uploaded Image"} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, image)}
                        />
                        
                        {/* //Image removal functionality still needs styling */}
                        <button onClick={() => handleRemove(i)} className="button">×</button>
                    </div>
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
                <button
                    className="addButton"
                    onClick={handlePlaceholderClick}
                    disabled={images.length >= MAX_SLOTS}
                    >
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
                style={{ display: 'none' }}
            />
            
        </div>
    )
}
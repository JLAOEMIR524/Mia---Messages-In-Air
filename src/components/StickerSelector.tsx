import type { DragPayload } from "../types/CanvasTypes";

const STICKERS = [
    { src: "./icons/stickers/100.avif"},
    { src: "./icons/stickers/airplane.avif", label: "⭐" },
    { src: "./icons/stickers/bee.avif", label: "⭐" },
    { src: "./icons/stickers/books.avif", label: "⭐" },
    { src: "./icons/stickers/computer.avif", label: "⭐" },
    { src: "./icons/stickers/hamburger.avif", label: "⭐" },
    { src: "./icons/stickers/hankey.avif", label: "⭐" },
    { src: "./icons/stickers/hole.avif", label: "⭐" },
    { src: "../icons/stickers/frog.avif", label: "⭐" },
    { src: "./icons/stickers/bug.avif", label: "⭐" },
    { src: "./icons/stickers/grinning.avif", label: "⭐" },
];

const STICKER_SIZE = 80;

export function StickerSelector() {
     const handleDragStart = async (e: React.DragEvent<HTMLImageElement>, src: string) => {
    
            const payload: DragPayload = {
                type: "sticker",
                src: src, 
                width: STICKER_SIZE, height: STICKER_SIZE,
            };
    
            e.dataTransfer.setData("application/postcard-element", JSON.stringify(payload));
            e.dataTransfer.effectAllowed = "copy";
        };
    
        return (
            <div className="galleryContainer">
                <div className="gallery">
                    {STICKERS.map((sticker, i) => (
                        <div className="barItem image" key={i}>
                            <img 
                                src={sticker.src}
                                alt={"Uploaded Image"} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, sticker.src)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
}
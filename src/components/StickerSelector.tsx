import type { DragPayload } from "../types/CanvasTypes";

const STICKERS = [
    { src: "./icons/add.svg", label: "⭐" },
    { src: "./icons/info.svg", label: "⭐" },
    { src: "./icons/letter.svg", label: "⭐" },
    { src: "./icons/right.svg", label: "⭐" },
    { src: "./icons/reload.svg", label: "⭐" },
    { src: "./icons/edit.svg", label: "⭐" },
    { src: "./icons/home.svg", label: "⭐" },
    { src: "./icons/pin.svg", label: "⭐" },
    { src: "./icons/profile.svg", label: "⭐" },
    { src: "./icons/text.svg", label: "⭐" },
    { src: "./icons/search.svg", label: "⭐" },
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
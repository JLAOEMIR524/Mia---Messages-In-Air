import type { AvailableSticker, DragPayload } from "../types/CanvasTypes";

const STICKERS = [
    { src: "./stickers/4.avif", label: "icon car"},
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

const STICKER_SIZE = 80;

export function StickerSelector({onImageClick}: {onImageClick: (src: AvailableSticker, size: number) => void}) {
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
                                onClick={() => onImageClick(sticker, STICKER_SIZE)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
}
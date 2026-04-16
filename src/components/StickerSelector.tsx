import type { DragPayload } from "../types/CanvasTypes";

const STICKERS = [
    { src: "./stickers/blue_car.avif", label: "icon car"},
    { src: "./stickers/airplane.avif", label: "icon plane" },
    { src: "./stickers/four_leaf_clover.avif", label: "icon four leaf clover" },
    { src: "./stickers/books.avif", label: "icon books" },
    { src: "./stickers/computer.avif", label: "icon computer" },
    { src: "./stickers/hamburger.avif", label: "icon hamburger" },
    { src: "./stickers/joy.avif", label: "icon joy" },
    { src: "./stickers/soccer.avif", label: "icon soccer" },
    { src: "./stickers/frog.avif", label: "icon frog" },
    { src: "./stickers/star2.avif", label: "icon star" },
    { src: "./stickers/heart.avif", label: "icon heart" },
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
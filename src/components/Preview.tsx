import { useEffect, useRef, useState } from "react";
import { fetchAdress, type Adress } from "../api/mockAdress";

interface PreviewProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Preview({isOpen, onClose}: PreviewProps) {
    const [adress, setAdress] = useState<Adress | null>(null);
    const cardFrontData = localStorage.getItem("card");
    const cardText = localStorage.getItem("currentPostcardText");
    const cardLocation = localStorage.getItem("selectedLocation");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
          try {
            const adress = await fetchAdress();
            setAdress(adress);
          } catch (error) {
            console.error("Error:", error);
          } 
        };
    
        loadData();
    }, []);
    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 0)

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }

    }, [isOpen, onClose]);

   

    if(!isOpen) return null;

    return (
        <dialog
            open
            className="previewContainer"
        >
            <div className="preview" ref={ref}>
                <div className="previewTop">
                    <h2>Preview</h2>
                    <img 
                        src="./icons/close.svg" 
                        alt="Close icon"
                        onClick={onClose}
                    />
                </div>
                    {cardFrontData && <img src={cardFrontData} className="postcardFront" alt="Your Postcard" />}
                    {cardText && cardLocation && adress &&
                        
                        <div className="postcardBack">
                            <p className="message">{cardText}</p>
                            <img src="./Stamp.png" alt="" />
                            <div className="adress">
                                <p>{adress.name}</p>
                                <p>{adress.street}</p>
                                <p>{adress.zip} {adress.city}</p>
                                <p>{adress.country}</p>
                            </div>
                        </div>
                    }
            </div>
        </dialog>
    )
}
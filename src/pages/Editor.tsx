import type Konva from 'konva';
import { Canvas } from '../components/Canvas'
import { PhotoUploader } from '../components/ImageSelector';
import { usePostcard } from '../hooks/usePostcard';
import { useRef, useCallback, useState } from 'react';
import { useResponsiveScale } from '../hooks/useResponsiveScale';
import { StickerSelector } from '../components/StickerSelector';
import { Step } from '../components/Step';

const CANVAS_WIDTH = 800;

export function Editor() {
    const stageRef = useRef<Konva.Stage | null>(null);
    const [currentBar, setBar] = useState<string>("image")
    const { scale } = useResponsiveScale(CANVAS_WIDTH);

    const {
        elements, selectedId, selectElement, addElementDrop, updateElement, deleteSelected,
    } = usePostcard();

    const handleExport = useCallback(() => {
        const stage = stageRef.current;
        if(!stage) return;

        selectElement(null);

        setTimeout(() => {
            const uri = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png"});
            const link = document.createElement("a");
            link.download = "postkarte.png";
            link.href = uri;
            link.click();
        }, 100)
    }, [selectElement])

    function getBar() {
        return currentBar === "image" ? <PhotoUploader/> 
        : currentBar === "sticker" ? <StickerSelector/>
        : <p>Text</p>;
    }

    function getImg() {
        return currentBar === "image" ? <PhotoUploader/> 
        : currentBar === "sticker" ? <StickerSelector/>
        : <p>Text</p>;
    }

    return (
        <main className='imageEditor'>
            <Step currentStep={2}/>
            <h2>Create Your Photo Collage 📸</h2>
            <p>Upload pictures and use stickers to create a unique collage.</p>
            <div className='imageEditor'>
                <div className='barSelector'>
                    <button 
                        className='button button--image'
                        onClick={() => setBar("image")}
                    >
                        <img src="./icons/image_w.svg" alt="image icon" aria-hidden="true"/>
                        Photos
                    </button>
                    <button 
                        className='button button--image'
                        onClick={() => setBar("sticker")}
                    >
                        <img src="./icons/star_shine_w.svg" alt="image icon" aria-hidden="true"/>
                        Stickers
                    </button>
                    <button 
                        className='button button--image'
                        onClick={() => setBar("text")}
                    >
                        <img src="./icons/text_w.svg" alt="image icon" aria-hidden="true"/>
                        Text
                    </button>
                </div>
                {getBar()}
                <Canvas
                    elements={elements}
                    selectedId={selectedId}
                    onSelect={selectElement}
                    onUpdate={updateElement}
                    onDrop={addElementDrop}
                    stageRef={stageRef}
                    scale={scale}
                />
                <div className='editActions'>
                    <button className="button button--primary" onClick={deleteSelected} disabled={!selectedId}>Delete</button>
                    <button className="button button--primary" onClick={handleExport}>Export</button>
                </div>
            </div>
        </main>
    );
}
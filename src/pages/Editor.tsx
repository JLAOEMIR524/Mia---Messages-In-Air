import type Konva from 'konva';
import { Canvas } from '../components/Canvas'
import { PhotoUploader } from '../components/ImageSelector';
import { usePostcard } from '../hooks/usePostcard';
import { useRef, useCallback, useState } from 'react';
import { useResponsiveScale } from '../hooks/useResponsiveScale';
import { StickerSelector } from '../components/StickerSelector';
import { Step } from '../components/Step';
import { Link } from 'react-router-dom';

const CANVAS_WIDTH = 800;

export function Editor() {
    const stageRef = useRef<Konva.Stage | null>(null);
    const [currentBar, setBar] = useState<string>("image")
    const [focus, setFocus] = useState<string | null>(null);
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

    return (
        <main className='imageEditor'>
            <Step currentStep={2}/>
            <h2>Create Your Photo Collage 📸</h2>
            <p>Upload pictures and use stickers to create a unique collage.</p>
            <div className='imageEditor'>
                <div className='barSelector'>
                    <button 
                        className={`button button--image ${ "image" === currentBar ? 'button--selected' : '' }`}
                        onClick={() => setBar("image")}
                        onMouseOver={() => setFocus("image")}
                        onMouseOut={() => setFocus(null)}
                    >
                        <img src={`./icons/image${"image" === currentBar || focus === "image" ? "_b" : "_w"}.svg`} alt="image icon" aria-hidden="true"/>
                        Photos
                    </button>
                    <button 
                        className={`button button--image ${ "sticker" === currentBar ? 'button--selected' : '' }`}
                        onClick={() => setBar("sticker")}
                        onMouseOver={() => setFocus("sticker")}
                        onMouseOut={() => setFocus(null)}
                    >
                        <img src={`./icons/star_shine${"sticker" === currentBar || focus === "sticker" ? "_b" : "_w"}.svg`} alt="image icon" aria-hidden="true"/>
                        Stickers
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
                    <button className="button button--primary" onClick={deleteSelected} disabled={!selectedId}>Delete Selected</button>
                    <button className="button button--primary" onClick={handleExport}>Export</button>
                </div>
            </div>
            <Link to="/message" style={{ textDecoration: "none", border: "none", marginTop: "2.5rem" }}>
                <button className="button button--image">
                Continue to message
                <span className="icon-span"></span>
                </button>
            </Link>
        </main>
    );
}
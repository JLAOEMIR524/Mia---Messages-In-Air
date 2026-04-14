import type Konva from 'konva';
import { Canvas } from '../components/Canvas'
import { PhotoUploader } from '../components/ImageSelector';
import { usePostcard } from '../hooks/usePostcard';
import { useRef, useCallback } from 'react';
import { useResponsiveScale } from '../hooks/useResponsiveScale';
import { StickerSelector } from '../components/StickerSelector';

const CANVAS_WIDTH = 800;

export function Editor() {
    const stageRef = useRef<Konva.Stage | null>(null);
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

    return (
        <>
            <img src="Logo.png" alt="random draggable image"/>
            <PhotoUploader/>
            <StickerSelector/>
            <Canvas
                elements={elements}
                selectedId={selectedId}
                onSelect={selectElement}
                onUpdate={updateElement}
                onDrop={addElementDrop}
                stageRef={stageRef}
                scale={scale}
            />
            <button className="button" onClick={deleteSelected} disabled={!selectedId}>Delete</button>
            <button className="button" onClick={handleExport}>Export</button>
        </>
    );
}
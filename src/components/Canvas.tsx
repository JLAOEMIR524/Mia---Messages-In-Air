import { Stage, Layer, Rect } from "react-konva";
import type { CanvasElement, DragPayload } from "../types/CanvasTypes";
import type React from "react";
import type Konva from "konva";
import { useEffect, useRef } from "react";
import { ImageNode } from "./ImageNode";
import { StickerNode } from "./StickerNode";


interface Props {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
    onDrop: (payload: DragPayload, x: number, y: number) => void;
    stageRef: React.RefObject<Konva.Stage | null>;
}

export function Canvas({elements, selectedId, onSelect, onUpdate, onDrop, stageRef}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if(!container) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if(e.dataTransfer) {
                e.dataTransfer.dropEffect = "copy";
            }
        }

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            const rawData = e.dataTransfer?.getData("application/postcard-element");
            if (!rawData) return;

            const payload: DragPayload = JSON.parse(rawData);

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            onDrop(payload, x, y);
        };
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("drop", handleDrop);

        return () => {
            container.removeEventListener("dragover", handleDragOver);
            container.removeEventListener("drop", handleDrop);
        };
    }, [ondrop]);

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if(e.target === e.target.getStage()){
            onSelect(null);
        }
    };


    return (
        <div
            ref={containerRef}
            style={{
                display: 'inline-block',
                border: '2px solid #ccc',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
        >
        <Stage ref={stageRef} width={800} height={600} onClick={handleStageClick}>
            <Layer>
                {elements.map(elem => {
                    elem.type === "image" ? (
                        <ImageNode
                            key={elem.id}
                            element={elem}
                            isSelected={elem.id === selectedId}
                            onSelect={() => onSelect(elem.id)}
                            onChange={(u) => onUpdate(elem.id, u)}
                        />
                    ) : (
                        <StickerNode
                            key={elem.id}
                            element={elem}
                            isSelected={elem.id === selectedId}
                            onSelect={() => onSelect(elem.id)}
                            onChange={(u) => onUpdate(elem.id, u)}
                        />
                    )
                })}
            </Layer>
        </Stage>
    </div>
    );
}
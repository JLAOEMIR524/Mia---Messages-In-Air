import { Stage, Layer, Rect } from "react-konva";
import type { CanvasElement, DragPayload } from "../types/CanvasTypes";
import type React from "react";
import type Konva from "konva";
import { useEffect, useRef } from "react";
import { ImageNode } from "./ImageNode";
import { StickerNode } from "./StickerNode";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

interface Props {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
    onDrop: (payload: DragPayload, x: number, y: number) => void;
    stageRef: React.RefObject<Konva.Stage | null>;
    scale: number;
}

export function Canvas({elements, selectedId, onSelect, onUpdate, onDrop, stageRef, scale}: Props) {
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
            const x = e.clientX - rect.left /scale;
            const y = e.clientY - rect.top /scale;

            onDrop(payload, x, y);
        };
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("drop", handleDrop);

        return () => {
            container.removeEventListener("dragover", handleDragOver);
            container.removeEventListener("drop", handleDrop);
        };
    }, [onDrop]);

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if(e.target === e.target.getStage()){
            onSelect(null);
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: CANVAS_WIDTH * scale,
                height: CANVAS_HEIGHT * scale,
                margin: "25px",
                boxSizing: "border-box",
                display: 'inline-block',
                border: '1px solid #ccc',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                }}
            >
        <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={handleStageClick}>
            <Layer>
                <Rect
                    fill={"white"}
                    width={CANVAS_WIDTH-5}
                    height={CANVAS_HEIGHT-5}
                    cornerRadius={20}
                    
                />
                {elements.map(elem => (
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
                ))}
            </Layer>
        </Stage>
        </div>
    </div>
    );
}
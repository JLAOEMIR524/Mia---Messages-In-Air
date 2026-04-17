import { useEffect, useRef } from "react";
import  useImage  from "use-image";
import Konva from "konva";
import type { ImageElement } from "../types/CanvasTypes";
import { Transformer, Image } from "react-konva";

interface Props {
    element: ImageElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (updates: Partial<ImageElement>) => void;
}

export function ImageNode({element, isSelected, onSelect, onChange}: Props) {
    const [img] = useImage(element.src);
    const shapeRef = useRef<Konva.Image | null>(null);
    const transformRef = useRef<Konva.Transformer | null>(null);

    useEffect(() => {
        if(isSelected && transformRef.current && shapeRef.current ){
            transformRef.current.nodes([shapeRef.current]);
            transformRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Image
                ref={shapeRef}
                image={img}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                scaleX={element.scaleX}
                scaleY={element.scaleY}
                rotation={element.rotation}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={(e) => {
                    onChange({x: e.target.x(), y: e.target.y()});
                }}
                onTransformEnd={() => {
                    const node = shapeRef.current;
                    if(!node) return;

                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    onChange({
                        x: node.x(), y: node.y(), 
                        width: Math.max(30, node.width() * scaleX), 
                        height: Math.max(30, node.height() * scaleY),
                        rotation: node.rotation(),
                        scaleX: 1, scaleY: 1,
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={transformRef}
                    keepRatio
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                    boundBoxFunc={(_, newBox) => {
                        if(newBox.width < 30 || newBox.height < 30) return _;
                        return newBox;
                    }}
                />
            )}
        </>
    );
}
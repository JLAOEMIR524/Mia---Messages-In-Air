import useImage from "use-image";
import type { StickerElement } from "../types/CanvasTypes";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";

interface Props {
  element: StickerElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<StickerElement>) => void;
}

export function StickerNode({
  element,
  isSelected,
  onSelect,
  onChange,
}: Props) {
  const [img] = useImage(element.src);
  const shapeRef = useRef<Konva.Image>(null);
  const transformRef = useRef<Konva.Transformer>(null);

  // Attaches the Transformer overlay to the targeted shape node on selection change
  useEffect(() => {
    if (isSelected && transformRef.current && shapeRef.current) {
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
        rotation={element.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        // Persists updated spatial coordinates to state storage when dragging stops
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        // Syncs rotation transformations to state and flattens node scale multipliers back to 1
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformRef}
          enabledAnchors={[]} // Disables resizing anchors to isolate rotation interactions only
          rotateEnabled={true}
          borderStroke="#3d64a8"
          borderStrokeWidth={2}
        />
      )}
    </>
  );
}

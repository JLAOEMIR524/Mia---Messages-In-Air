import { useCallback, useState } from "react";
import type { CanvasElement, DragPayload, ImageElement, StickerElement } from "../types/CanvasTypes";
import { v4 as uuidv4 } from "uuid";


export function usePostcard() {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectElement = useCallback((id: string | null) => {
        setSelectedId(id);
    }, [])

    const addElementDrop = useCallback((payload: DragPayload, x: number, y: number) => {
        if(payload.type === "sticker"){
            const sticker: StickerElement = {
                id: uuidv4(),
                type: "sticker",
                x: x - payload.width / 2,
                y: y - payload.height / 2,
                src: payload.src,
                width: payload.width,
                height: payload.height,
                rotation: 0,
            };
            setElements(prev => [...prev, sticker]);
            setSelectedId(sticker.id);
        }

        if(payload.type === "image"){
            const image: ImageElement = {
                id: uuidv4(),
                type: "image",
                x: x - payload.width / 2,
                y: y - payload.height / 2,
                src: payload.src,
                width: payload.width,
                height: payload.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            };
            setElements(prev => [...prev, image]);
            setSelectedId(image.id);
        }
    }, []);

    const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
        setElements(prev => 
            prev.map(elem => (elem.id === id ? { ...elem, ...updates} as CanvasElement : elem))
        );
    }, []);

    const deleteSelected = useCallback(() => {
        if(!selectedId) return;
        //Keeps all elements except the selected one
        setElements(prev => prev.filter(elem => elem.id !== selectedId));
        setSelectedId(null);
    }, [selectedId]);

    const upSelected = useCallback(() => {
        if(!selectedId) return;
        setElements((prev) => {
            const index = prev.findIndex((element) => element.id === selectedId);
            if(index < 0 || index >= prev.length - 1) return prev;
            const newArray = [...prev];
            [newArray[index + 1], newArray[index]] = [newArray[index], newArray[index + 1]]
            return newArray;
        })
    }, [selectedId])

    const downSelected = useCallback(() => {
        if(!selectedId) return;
        setElements((prev) => {
            const index = prev.findIndex((element) => element.id === selectedId);
            if(index <= 0) return prev;
            const newArray = [...prev];
            [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]]
            return newArray;
        })
    }, [selectedId])

    const addElementRandom = useCallback((payload: DragPayload, canvasWidth: number, canvasHeight: number) => {
        const x = Math.random() * (canvasWidth - payload.width) + payload.width / 2;
        const y = Math.random() * (canvasHeight - payload.height) + payload.height / 2;
        addElementDrop(payload, x, y);
    }, [addElementDrop]);

    const moveSelected = useCallback((moveDirectionx: number, moveDirectiony: number) => {
        if(!selectElement) return;
        setElements(prev => 
            prev.map((element) => 
                element.id === selectedId ? 
                    {...element, x: element.x + moveDirectionx, y: element.y + moveDirectiony } as CanvasElement
                    : element
        ))
    }, [selectedId, selectElement])

    return {
        elements, selectedId, selectElement, addElementDrop, updateElement, 
        deleteSelected, upSelected, downSelected, addElementRandom, moveSelected,
    };
}
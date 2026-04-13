import { Canvas } from '../components/Canvas'
import { PhotoUploader } from '../components/ImageSelector';

export function Editor() {

    return (
        <>
            <img src="Logo.png" alt="random draggable image"/>
            <PhotoUploader/>
            <Canvas
                elements={elememts}
                selectedId={selectedId}
                onSelect={selectElemt}
                onUpdate={updateElement}
                onDrop={addElementFromDrop}
                stageRef={stageRef}
            />
        </>
    );
}
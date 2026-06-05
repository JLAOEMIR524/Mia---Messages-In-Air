import { useMap } from "react-leaflet";
import { useEffect } from "react";

export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());

    return () => observer.disconnect();
  }, [map]);

  return null;
}

import { useCallback, useEffect, useState } from "react";

interface ResponsiveScale {
  scale: number;
  containerWidth: number;
}

export function useResponsiveScale(
  canvasWidth: number,
  padding: number = 50,
): ResponsiveScale {
  // Computes aspect-ratio preservation scale factor capped at a maximum multiplier of 1.0
  const calcScale = useCallback(() => {
    const availableWidth = window.innerWidth - padding;
    const scale = Math.min(1, availableWidth / canvasWidth);

    return { scale, containerWidth: canvasWidth * scale };
  }, [canvasWidth, padding]);

  const [result, setResult] = useState<ResponsiveScale>(calcScale);

  // Binds resize event listener
  useEffect(() => {
    const handleResize = () => setResult(calcScale());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calcScale]);
  return result;
}

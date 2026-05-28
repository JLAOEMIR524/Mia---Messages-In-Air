import { useEffect, useState } from "react";

interface PopupProps {
  actions: string[];
  time: number;
}

export function Popup({ actions, time }: PopupProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => prev + 1), 1500);

    return () => clearInterval(interval);
  }, [time]);

  const wantsReducedMotion = !window.matchMedia(
    "(prefers-reduced-motion: no-preference)",
  ).matches;

  return (
    <div className="loadPopup">
      {wantsReducedMotion === true ? null : <div className="loader"></div>}
      <p>{actions[current % time]}</p>
    </div>
  );
}

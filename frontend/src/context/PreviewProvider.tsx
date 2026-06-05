import { useCallback, useState } from "react";
import { PreviewContext } from "./PreviewContext";
import { useLocation } from "react-router-dom";

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const [openedAtPath, setOpenedAtPath] = useState<string | null>(null);

  const previewOpen = openedAtPath === location.pathname;
  const setPreviewOpen = useCallback(
    (open: boolean) => {
      setOpenedAtPath(open ? location.pathname : null);
    },
    [location.pathname],
  );

  return (
    <PreviewContext.Provider value={{ previewOpen, setPreviewOpen }}>
      {children}
    </PreviewContext.Provider>
  );
}

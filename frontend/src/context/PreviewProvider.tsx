import { useEffect, useState } from "react";
import { PreviewContext } from "./PreviewContext";
import { useLocation } from "react-router-dom";

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setPreviewOpen(false);
  }, [location.pathname]);
  
  return (
    <PreviewContext.Provider value={{ previewOpen, setPreviewOpen }}>
      {children}
    </PreviewContext.Provider>
  );
}

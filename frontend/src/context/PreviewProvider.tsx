import { useState } from "react";
import { PreviewContext } from "./PreviewContext";

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <PreviewContext.Provider value={{ previewOpen, setPreviewOpen }}>
      {children}
    </PreviewContext.Provider>
  );
}

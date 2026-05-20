import { createContext, useContext, useState } from "react";

const PreviewContext = createContext({
  previewOpen: false,
  setPreviewOpen: (_: boolean) => {},
});

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <PreviewContext.Provider value={{ previewOpen, setPreviewOpen }}>
      {children}
    </PreviewContext.Provider>
  );
}

// Custom hook providing direct consumer access to the underlying context state
export const usePreview = () => useContext(PreviewContext);

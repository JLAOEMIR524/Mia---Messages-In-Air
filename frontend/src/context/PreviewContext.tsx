import { createContext } from "react";

interface PreviewContextType {
  previewOpen: boolean;
  setPreviewOpen: (value: boolean) => void;
}

export const PreviewContext = createContext<PreviewContextType>({
  previewOpen: false,
  setPreviewOpen: () => {},
});

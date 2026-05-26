import { useContext, useEffect } from "react";
import { PreviewContext } from "../context/PreviewContext";

export const usePreview = () => {
  const { previewOpen, setPreviewOpen } = useContext(PreviewContext);

  //Prevents background scroll when the preview is open
  useEffect(() => {
    document.body.style.overflow = previewOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  return { previewOpen, setPreviewOpen };
};

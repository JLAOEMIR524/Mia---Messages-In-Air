import { useContext } from "react";
import { PreviewContext } from "../context/PreviewContext";

// Custom hook providing direct consumer access to the underlying context state
export const usePreview = () => useContext(PreviewContext);

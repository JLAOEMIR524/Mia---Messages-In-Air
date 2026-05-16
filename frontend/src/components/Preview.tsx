import { useEffect } from "react";

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Preview({
  isOpen,
  onClose,
  title = "Preview",
  children,
  className,
}: PreviewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      open
      className="previewContainer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`preview ${className || ""}`}>
        <div className="previewTop">
          <h1 className="text-l">{title}</h1>
          <button
            className="closePreview"
            onClick={onClose}
            aria-label="Close Preview"
          >
            <img src="./icons/close.svg" alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="previewContent">{children}</div>
      </div>
    </dialog>
  );
}

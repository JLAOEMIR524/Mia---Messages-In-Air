import { useEffect, useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
    <dialog open className="previewContainer">
      <div className={`preview ${className || ""}`} ref={ref}>
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

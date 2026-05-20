import { Link } from "react-router-dom";

interface MessagePreviewProps {
  titel: string;
  country: string;
  previewText: string;
  statusIcon?: string;
  flagIcon?: string;
  to: string;
}

export function MessagePreview({
  titel: title,
  country,
  previewText,
  statusIcon = "./icons/paper-plane-white.svg", // Fallback status icon
  flagIcon = "./icons/flag.svg", // Fallback country flag
  to,
}: MessagePreviewProps) {
  return (
    <Link to={to} className="messagePreview preview--from">
      <div className="messagePreview__icon-wrapper">
        <img
          src={statusIcon}
          alt="Status (will be filled with the actual status later)"
        />
      </div>

      <div className="messagePreview__infos">
        <h3>{title}</h3>

        <div className="messagePreview__country">
          <img src={flagIcon} alt="" aria-hidden="true" />
          <p>{country}</p>
        </div>

        <p className="messagePreview__text">{previewText}</p>
      </div>
    </Link>
  );
}

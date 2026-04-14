interface MessagePreviewProps {
  titel: string;
  country: string;
  previewText: string;
  statusIcon?: string;
  flagIcon?: string;
  onClick?: () => void;
}

export function MessagePreview({ 
  titel: title, 
  country, 
  previewText, 
  statusIcon = "./icons/paper-plane-white.svg", 
  flagIcon = "./icons/flag.svg",
  onClick 
}: MessagePreviewProps) {
  return (
    <button className="messagePreview preview--from" onClick={onClick}>
      <div className="messagePreview__icon-wrapper">
        <img src={statusIcon} alt="Status" />
      </div>
      
      <div className="messagePreview__infos">
        <h3>{title}</h3>
        
        <div className="messagePreview__country">
          <img src={flagIcon} alt="" aria-hidden="true" />
          <p>{country}</p>
        </div>
        
        <p className="messagePreview__text">{previewText}</p>
      </div>
    </button>
  );
}
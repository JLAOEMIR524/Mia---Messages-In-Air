interface CardProps {
  image?: string;
  title?: string;
  description?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function Card({ 
  image, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  className = "" 
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      {image && <img src={image} alt={title || "Card Image"} />}
      
      <div className="card__body">
        {title && <h3>{title}</h3>}
        
        {description && <p>{description}</p>}
        
        {buttonText && (
          <button className="button button--primary" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
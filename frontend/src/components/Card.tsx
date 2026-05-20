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
  className = "",
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      {/* only render image if a path is given */}
      {image && <img src={image} alt={title || "Card Image"} />}

      <div className="card__body">
        {title && <h3>{title}</h3>}

        {description && <p>{description}</p>}

        {/* action button is optional, only shows up if text is set */}
        {buttonText && (
          <button className="button button--primary" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

interface LinkHeaderProps {
  title: string;
  icon: string;
  linkTo: string;
  linkText?: string;
}

export function LinkHeader({
  title,
  icon,
  linkTo,
  // fallback text if no specific label is provided
  linkText = "Show all Postcards",
}: LinkHeaderProps) {
  return (
    <div className="linkHeader">
      <div className="linkHeader__group">
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="linkHeader__icon"
        />
        <h2 className="text-xs">{title}</h2>
      </div>

      <Link to={linkTo} className="linkHeader__link" aria-label="Go to the gallery">
        {linkText}
        <img
          src="./icons/link-blue.svg"
          alt=""
          aria-hidden="true"
          className="linkHeader__link-icon"
        />
      </Link>
    </div>
  );
}

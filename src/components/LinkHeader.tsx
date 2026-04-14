import { Link } from "react-router-dom";

interface LinkHeaderProps {
  title: string;
  icon: string;
  linkTo: string;
  linkText?: string;
}

export function LinkHeader({ title, icon, linkTo, linkText = "Show all" }: LinkHeaderProps) {
  return (
    <div className="linkHeader">
      <div className="linkHeader__group">
        <img src={icon} alt="" aria-hidden="true" className="linkHeader__icon" />
        <h5>{title}</h5>
      </div>

      <Link to={linkTo} className="linkHeader__link">
        {linkText}
        <img src="./icons/link-blue.svg" alt="" aria-hidden="true" className="linkHeader__link-icon" />
      </Link>
    </div>
  );
}
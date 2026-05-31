import { Link } from "react-router-dom";

export const NavBarTop = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo-top">
        <img src="/Logo_without_text.png" alt="Mia Dashboard" />
      </Link>

      <Link to="/login" className="nav-login" aria-label="login">
        <img src="/icons/login.svg" alt="" aria-hidden="true" />
      </Link>
    </nav>
  );
};

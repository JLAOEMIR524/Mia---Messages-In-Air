import { Link } from 'react-router-dom';

export const NavBarTop = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo-top">
        <img src="/Logo_without_text.png" alt="Mia Logo" />
      </Link>

      <Link to="/login" className="nav-login">
        <img src="/icons/login.svg" alt="Login" />
      </Link>
    </nav>
  );
};
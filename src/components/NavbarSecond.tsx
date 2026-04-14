import { Link } from 'react-router-dom';

export const NavBarSecond = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo">
        <img src="/Logo_without_text.png" alt="Mia Logo" />
      </Link>

      <Link to="/login" className="nav-login">
        <img src="/icons/login.svg" alt="Login" />
      </Link>
    </nav>
  );
};
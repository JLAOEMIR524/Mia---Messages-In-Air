import { signOut } from "../api/auth-client";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface NavBarProps {
  inert?: boolean;
}

export function NavBar({ inert }: NavBarProps) {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "./icons/home.svg" },
    { name: "Profile", path: "/profile", icon: "./icons/profile.svg" },
    { name: "Generate Postcard", path: "/quest", icon: "./icons/email.svg" },
    { name: "Gallery", path: "/gallery", icon: "./icons/image.svg" },
    { name: "Imprint & Privacy", path: "/imprint", icon: "./icons/info.svg" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  return (
    <aside
      inert={inert ? true : undefined}
      className={`sidebar ${isOpen ? "is-open" : ""}`}
    >
      <div className="topContainer">
        <div className="mobileBar">
          {!isMobile ? (
            <Link to="/dashboard" tabIndex={-1}>
              <img className="logo" src="./Logo.png" alt="Mia Logo" />
            </Link>
          ) : isDashboard ? (
            <Link to="/dashboard" tabIndex={-1}>
              <img
                className="logo"
                src="./Logo_without_text.png"
                alt="Mia Logo"
              />
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="StepBackNav"
              aria-label="go back"
            >
              <img
                className="backIconSmall"
                src="/icons/arrow-back.svg"
                alt=""
                aria-hidden="true"
                style={{ width: "30px", margin: "var(--space-xs) 0" }}
              />
            </button>
          )}

          <button
            className={`hamburger-menu ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Burger-menu open"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav aria-label="Main Menu">
          <ul>
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                <img src={item.icon} alt="" aria-hidden="true" />
                <Link to={item.path} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}

            {isMobile && (
              <li
                className={`nav-item logout-mobile ${location.pathname === "/logout" ? "active" : ""}`}
              >
                <img src="./icons/logout.svg" alt="" aria-hidden="true" />
                <button
                  className="logout"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {!isMobile && (
        <button className="logout" onClick={handleLogout}>
          <img src="./icons/logout.svg" alt="" aria-hidden="true" />
          <span>Logout</span>
        </button>
      )}
    </aside>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "./icons/home.svg" },
    { name: "Profile", path: "/profile", icon: "./icons/profile.svg" },
    { name: "Generate Postcard", path: "/generate", icon: "./icons/email.svg" },
    { name: "Gallery", path: "/gallery", icon: "./icons/image.svg" },
    { name: "Imprint & Privacy", path: "/imprint", icon: "./icons/info.svg" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="topContainer">
        <div className="mobileBar">
          <img
            className="logo"
            src={isMobile ? "./Logo_without_text.png" : "./Logo.png"}
            alt="Mia Logo"
          />

          <div
            className={`hamburger-menu ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <nav>
          {navItems.map((item, index) => (
            /* 3. Hier prüfen wir, ob der Pfad aktiv ist */
            <div
              key={index}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <img src={item.icon} alt={`${item.name} icon`} />
              <Link to={item.path} onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            </div>
          ))}

          {isMobile && (
            <div
              className={`nav-item logout-mobile ${location.pathname === "/logout" ? "active" : ""}`}
            >
              <img src="./icons/logout.svg" alt="logout icon" />
              <Link to="/logout" onClick={() => setIsOpen(false)}>
                Logout
              </Link>
            </div>
          )}
        </nav>
      </div>

      {!isMobile && (
        <div className="logout">
          <img src="./icons/logout.svg" alt="logout icon" />
          <Link to="/logout">Logout</Link>
        </div>
      )}
    </div>
  );
}

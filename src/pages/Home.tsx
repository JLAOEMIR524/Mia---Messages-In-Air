import { useEffect } from "react";
import { NavBarTop } from "../components/NavbarTop";
import { Link } from "react-router-dom";

export function Home() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Home";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  return (
    <main className="heaven">
      <NavBarTop />
      <section className="Home">
        <h1>
          Mia <span>Messages in Air</span>
        </h1>
        <div className="center">
          <p>A postcard to a stranger.</p>
          <p>No likes. No followers. No feed.</p>
          <p>Just real, unexpected messages.</p>
        </div>
        <div className="button-flex homeButton">
          <Link to="/login" className="button button--primary">
            Start now
          </Link>
          <button className="button button--secondary">Find out more</button>
        </div>
        <Link to="/login">
          <img
            src="./icons/letter-blue.svg"
            alt="Icon Mail"
            className="email-icon"
          />
        </Link>
      </section>
    </main>
  );
}

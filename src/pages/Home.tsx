import { useEffect } from "react";
import { NavBarTop } from "../components/NavbarTop";

export function Home() {
  useEffect(() => {
    document.body.classList.add("background-heaven");

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);
  return (
    <main className="heaven">
      <NavBarTop />
      <h1>
        Mia <span>Messages in Air</span>
      </h1>
      <div>
        <p>A postcard to a stranger.</p>
        <p>No likes. No followers. No feed.</p>
        <p>Just real, unexpected messages.</p>
      </div>
      <div className="button-flex gallery">
        <button className="button button--primary">Start now</button>
        <button className="button button--secondary">Find out more</button>
      </div>
      <img
        src="./icons/letter-blue.svg"
        alt="Icon Mail"
        className="email-icon"
      />
    </main>
  );
}

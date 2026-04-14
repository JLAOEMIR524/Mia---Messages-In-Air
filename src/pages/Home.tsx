import { NavBarSecond } from "../components/NavbarSecond";

export function Home() {
  return (
    <main className="home">
      <NavBarSecond />
      <h1>
        Mia <span>Messages in Air</span>
      </h1>
      <div>
      <p>A postcard to a stranger.</p>
      <p>No likes. No followers. No feed.</p>
      <p>Just real, unexpected messages.</p>
      </div>
      <div className="button-flex">
        <button className="button button--primary">
          Start now
        </button>
        <button className="button button--primary">
          Find out more
        </button>
      </div>
      <img src="./icons/letter-blue.svg" alt="Icon Mail" className="email-icon"/>
    </main>
  );
}

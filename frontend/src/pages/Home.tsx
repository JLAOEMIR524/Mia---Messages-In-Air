import { useEffect, useState } from "react";
import { NavBarTop } from "../components/NavbarTop";
import { Link } from "react-router-dom";
import { Preview } from "../components/Preview";

export function Home() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Home";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const [showPreview, setShowPreview] = useState(false);

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
          <button
            className="button button--secondary"
            onClick={() => setShowPreview(true)}
          >
            Find out more
          </button>
        </div>
        <Link to="/login">
          <img
            src="./icons/letter-blue.svg"
            alt="Icon Mail"
            className="email-icon"
          />
        </Link>
        <Preview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="The Idea Behind Mia"
          className="home-preview"
        >
          <div className="info-content">
            <section>
              <h2 className="text-s">Tired of the Digital Noise?</h2>
              <p>
                Everything today feels like an algorithm. We stand in a digital
                marketplace trying to sell ourselves.
                Mia is different. It’s a digital safe space for
                those who are "Social Media tired."
              </p>
            </section>

            <section>
              <h2 className="text-s">Digital Message in a Bottle</h2>
              <p>
                Mia lets you create something with love. You design a postcard,
                complete a small creative Quest, and send it
                out like a digital message in a bottle to a random person
                somewhere in the world.
              </p>
              <ul className="value-list">
                <li>
                  ✨ <strong>No likes.</strong> Just genuine connection.
                </li>
                <li>
                  ✨ <strong>No followers.</strong> No pressure to perform.
                </li>
                <li>
                  ✨ <strong>No feed.</strong> No endless scrolling.
                </li>
              </ul>
            </section>
              <Link
                to="/imprint"
                className="impressum-link"
                onClick={() => setShowPreview(false)}
              >
                Imprint & Privacy
              </Link>
          </div>
        </Preview>
      </section>
    </main>
  );
}

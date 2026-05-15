import { Link } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect } from "react";

export function Details() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Detail Feedback";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  return (
    <main className="heaven">
      <Link
        to="/send"
        state={{ fromMessage: true }}
        className="arrowBack"
        aria-label="back to overview"
      >
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>

      <FeedbackCard
        title="Rating - Details"
        topIconSrc="./icons/grading-white.svg"
        message={
          <>
            <p>Length of Poscard: 3/5</p>
            <p>Bad words: 1/5</p>
            <p>Capitalisation: 4/5</p>
            <p>Punctuation: 2/5</p>
            <h2 className="text-xs">Quest Fullfillment:</h2>
            <p>Punkt 1: 4/5</p>
            <p>Punkt 2: 2/5</p>
            <p>Punkt 3: 3/5</p>
          </>
        }
        xpAmount={30}
        onContinue={() => (window.location.href = "/dashboard")}
      />
    </main>
  );
}

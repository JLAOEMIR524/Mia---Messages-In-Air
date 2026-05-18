import { Link, useLocation } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect, useState } from "react";

interface LocationState {
  fromMessage?: boolean;
  analysis?: {
    ratings: {
      length: number;
      badWords: number;
      capitalization: number;
      punctuation: number;
    };
    questFulfillment: Array<{ name: string; score: number }>;
    xpCalculation: {
      baseXP: number;
      questXP: number;
      totalXP: number;
      percentage: number;
    };
  };
}

export function Details() {
  const location = useLocation();

  const [analysis] = useState(() => {
    const routerState = location.state as LocationState | null;
    if (routerState?.analysis) {
      return routerState.analysis;
    }
    const backup = sessionStorage.getItem("last_postcard_analysis");
    return backup ? JSON.parse(backup) : null;
  });

  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Detail Feedback";
    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const ratings = analysis?.ratings ?? {
    length: 0,
    badWords: 0,
    capitalization: 0,
    punctuation: 0,
  };
  const questFulfillment = analysis?.questFulfillment ?? [];
  const totalXp = analysis?.xpCalculation?.totalXP ?? 0;

  return (
    <main className="heaven">
      <Link
        to="/send"
        state={{ fromMessage: true, analysis: analysis }}
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
            <p>Length of Postcard: {ratings.length}/5</p>
            <p>No bad words: {ratings.badWords}/5</p>
            <p>Capitalisation: {ratings.capitalization}/5</p>
            <p>Punctuation: {ratings.punctuation}/5</p>

            {questFulfillment.length > 0 && (
              <>
                <h2
                  className="text-xs"
                >
                  Quest Fulfillment:
                </h2>
                {questFulfillment.map((item: any, index: number) => (
                  <p key={index}>
                    {item.name}: {item.score}/5
                  </p>
                ))}
              </>
            )}
          </>
        }
        xpAmount={totalXp}
        onContinue={() => {
          sessionStorage.removeItem("last_postcard_analysis");
          window.location.href = "/dashboard";
        }}
      />
    </main>
  );
}
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

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

export function Send() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tracks window dimensions dynamically for the confetti effect
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Initializes analysis from state or falls back to sessionStorage on reload
  const [analysis] = useState(() => {
    const state = location.state as LocationState | null;
    if (state?.analysis) {
      sessionStorage.setItem(
        "last_postcard_analysis",
        JSON.stringify(state.analysis),
      );
      return state.analysis;
    }
    const backup = sessionStorage.getItem("last_postcard_analysis");
    return backup ? JSON.parse(backup) : null;
  });

  // Adds layout classes and sets up the window resize listener
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Postcard Sent";

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.classList.remove("background-heaven");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalXp = analysis?.xpCalculation?.totalXP ?? 0;
  const percentage = analysis?.xpCalculation?.percentage ?? 0;

  return (
    <main className="heaven">
      <Link to="/dashboard" className="arrowBack" aria-label="go back">
        <img src="./icons/close.svg" alt="Arrow Back Icon" aria-hidden="true" />
      </Link>
      <FeedbackCard
        title="Postcard Sent! 🎉"
        message={<>Quest Rating</>}
        rating={Math.round((percentage / 100) * 5)}
        xpAmount={totalXp}
        onContinue={() => {
          sessionStorage.removeItem("last_postcard_analysis");
          navigate("/dashboard");
        }}
        onSeeDetails={() =>
          navigate("/details", { state: { fromMessage: true, analysis } })
        }
      />
      <Confetti
        numberOfPieces={450}
        recycle={false}
        width={windowSize.width}
        height={windowSize.height}
      />
    </main>
  );
}

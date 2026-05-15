import { Link, useNavigate } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect } from "react";
import Confetti from "react-confetti";

export function Send() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Postcard Send";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const navigate = useNavigate();

  return (
    <main className="heaven">
      <Link to="/dashboard" className="arrowBack" aria-label="go back">
        <img src="./icons/close.svg" alt="Arrow Back Icon" aria-hidden="true" />
      </Link>
      <FeedbackCard
        title="Postcard Sent! 🎉"
        message={<>Quest Rating</>}
        rating={2}
        xpAmount={30}
        onContinue={() => navigate("/dashboard")}
        onSeeDetails={() => navigate("/details", { state: { fromSend: true } })}
      />
      <Confetti
        numberOfPieces={450}
        recycle={false}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </main>
  );
}

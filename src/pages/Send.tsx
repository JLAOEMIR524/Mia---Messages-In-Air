import { useNavigate } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect } from "react";
import Confetti from "react-confetti";

export function Send() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Postcard Send"

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const navigate = useNavigate();

  return (
    <main className="heaven">
      <button onClick={() => navigate("/dashboard")} className="arrowBack">
        <img src="./icons/close.svg" alt="Arrow Back Icon" />
      </button>
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

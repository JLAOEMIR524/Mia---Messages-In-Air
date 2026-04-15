import { useNavigate } from "react-router-dom";
import { FeedbackCard } from "../components/SendCards";
import { useEffect } from "react";

export function Send() {
    useEffect(() => {
      document.body.classList.add("background-heaven");
  
      return () => {
        document.body.classList.remove("background-heaven");
      };
    }, []);
    
  const navigate = useNavigate();

  return (
    <main className="heaven">
      <button onClick={() => navigate("/dashboard")} className="arrowBack">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </button>
      <FeedbackCard
        title="Postcard Sent! 🎉"
        message={<>Quest Rating</>}
        rating={2}
        xpAmount={30}
        onContinue={() => (window.location.href = "/dashboard")}
        onSeeDetails={() => (window.location.href = "/details")}
      />
    </main>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
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
    </main>
  );
}

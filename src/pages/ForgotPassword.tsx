import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ForgotPassword() {
  useEffect(() => {
    document.body.classList.add("background-heaven");

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const navigate = useNavigate();
  return (
    <main className="heaven">
      <button onClick={() => navigate("/home")} className="arrowBack">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </button>
      <div className="PasswordContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h5>Forgot your password?</h5>
        <p>No problem! We're here to help 🔑</p>
        <p className="limitParagraph">Enter your email address and we'll send you a link to reset your password.</p>
        <form>
          <label htmlFor="emailUser">E-Mail:</label>
          <input
            id="emailUser"
            name="emailUser"
            type="email"
            placeholder="mia@email.com"
            required
          />
        </form>
        <button
          className="button button--primary"
          onClick={() => navigate("/login")}
        >
          Send Link
        </button>
        <div className="LinkContainer">
          <img src="./icons/arrow-back-blue.svg" alt="Icon arrow Back" />
          <Link to="/login">Back to Log In</Link>
        </div>
      </div>
    </main>
  );
}

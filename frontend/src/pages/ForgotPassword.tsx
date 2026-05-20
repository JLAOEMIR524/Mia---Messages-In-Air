import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth-client";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Forgot Password";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  async function handleReset() {
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    navigate("/login");
  }

  return (
    <main className="heaven">
      <Link to="/home" className="arrowBack" aria-label="go back">
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>
      <div className="PasswordContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Forgot your password?</h1>
        <p>No problem! We're here to help 🔑</p>
        <p className="limitParagraph">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form>
          <label htmlFor="emailUser">E-Mail:</label>
          <input
            id="emailUser"
            name="emailUser"
            type="email"
            placeholder="mia@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </form>
        <button className="button button--primary" onClick={handleReset}>
          Send Link
        </button>
        <div className="LinkContainer">
          <img src="./icons/arrow-back-blue.svg" alt="" aria-hidden="true" />
          <Link to="/login">Back to Log In</Link>
        </div>
      </div>
    </main>
  );
}

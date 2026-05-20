import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth-client";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Forgot Password";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    const { error: authError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "http://localhost:5173/reset-password",
    });

    setLoading(false);

    if (authError) {
      console.error("Password reset request failed:", authError);

      if (authError.message?.includes("Daily email limit reached") || authError.status === 429) {
        setError(
          "Our email system is out of tokens for today. We cannot send reset links right now. Please try again tomorrow!"
        );
      } else {
        setError(authError.message || "An error occurred. Please try again.");
      }
      return;
    }

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

        <form onSubmit={handleReset}>
          {error && (
            <p className="authenticationError" role="alert" style={{ marginBottom: "15px" }}>
              {error}
            </p>
          )}

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
            disabled={loading}
          />

          <button 
            type="submit" 
            className="button button--primary" 
            disabled={loading}
            style={{ marginTop: "15px", width: "100%" }}
          >
            {loading ? "..." : "Send Link"}
          </button>
        </form>

        <div className="LinkContainer">
          <img src="./icons/arrow-back-blue.svg" alt="" aria-hidden="true" />
          <Link to="/login">Back to Log In</Link>
        </div>
      </div>
    </main>
  );
}
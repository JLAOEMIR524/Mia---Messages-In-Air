import { authClient } from "../api/auth-client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();

  // Safely extracts the token from the URL on component mount
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  async function handleReset() {
    setLoading(true);
    setError("");

    // Validates that both passwords match
    if (password !== passwordConfirm) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      // Checks if the password has been leaked in data breaches
      const check = await fetch(
        `${import.meta.env.VITE_API_URL}/api/security/check-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password }),
        },
      );

      const { isPwned } = await check.json();

      if (isPwned) {
        setError("Unsafe password - try choosing something sophisticated");
        setLoading(false);
        return;
      }

      // Sends the new password along with the recovery token to the auth client
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token: token!,
      });

      if (resetError) {
        setError(resetError.message!);
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // Prevents rendering anything until the token check is complete
  if (!token) return null;

  return (
    <main className="background-heaven heaven">
      <Link to="/home" className="arrowBack" aria-label="go back">
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>
      <div className="PasswordContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Reset your Password</h1>
        <p className="limitParagraph">
          Enter your new Password below to reset it.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReset();
          }}
        >
          {error && (
            <p className="authenticationError" role="alert">
              {error}
            </p>
          )}
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="pass****"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <label htmlFor="passwordConfirm">Confirm password:</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="pass****"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="button button--primary"
            disabled={loading}
          >
            {loading ? "..." : "Reset Password"}
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

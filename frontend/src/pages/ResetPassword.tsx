import { authClient } from "../api/auth-client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    navigate("/login");
    return;
  }

  async function handleReset() {
    setLoading(true);
    if (password !== passwordConfirm) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    const check = await fetch(
      "http://localhost:3001/api/security/check-password",
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

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });

    if (error) {
      setError(error.message!);
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
          <p className="authenticationError">{error}</p>
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
          />
          <button
            type="submit"
            className="button button--primary"
            disabled={loading}
          >
            {loading ? "..." : "Create Account"}
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

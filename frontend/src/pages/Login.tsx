import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, useSession } from "../api/auth-client";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Login";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  // Redirects logged-in users directly to the dashboard
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleLogin = async () => {
    await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          setLoading(false);
          setPassword("");
          setError(ctx.error.message);
        },
      },
    );
  };

  //Starts the Passkey generation process
  const handlePasskey = async () => {
    await signIn.passkey({
      /* autoFill: true, */
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onError(ctx) {
          setLoading(false);
          setError(ctx.error.message);
        },
      },
    });
  };

  return (
    <main className="heaven">
      <Link to="/home" className="arrowBack" aria-label="go back">
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>
      <div className="LoginContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Welcome Back!</h1>
        <p>Nice to see you again ✨ </p>
        <form>
          {error && (
            <p id="email-error" className="authenticationError" role="alert">
              Error: {error}
            </p>
          )}
          <label htmlFor="emailUser">E-Mail:</label>
          <input
            id="emailUser"
            name="emailUser"
            type="email"
            placeholder="Type here..."
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </form>
        <Link to="/password">Password forgotten?</Link>
        <div className="login-options">
          <button
            className="button button--primary"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "..." : "Sign In"}
          </button>
          <button
            className="button button--primary"
            disabled={loading}
            onClick={handlePasskey}
          >
            Passkey
          </button>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <p>New to Mia?</p>
        <Link to="/register" className="button button--secondary">
          Create an account
        </Link>
      </div>
    </main>
  );
}

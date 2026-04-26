import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Login";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  const navigate = useNavigate();
  return (
    <main className="heaven">
      <Link to="/home" className="arrowBack" aria-label="Back">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </Link>
      <div className="LoginContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Welcome Back!</h1>
        <p>Nice to see you again ✨ </p>
        <form>
          <label htmlFor="emailUser">E-Mail:</label>
          <input
            id="emailUser"
            name="emailUser"
            type="email"
            placeholder="Type here..."
            autoComplete="email"
            required
          />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </form>
        <Link to="/password">Password forgotten?</Link>
        <button
          className="button button--primary"
          onClick={() => navigate("/dashboard")}
        >
          Sign In
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <p>New to Mia?</p>
        <Link
          to="/register"
          className="button button--secondary"
        >
          Create an account
        </Link>
      </div>
    </main>
  );
}

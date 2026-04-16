import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
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
      <div className="LoginContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h5>Welcome Back!</h5>
        <p>Nice to see you again ✨ </p>
        <form>
          <label htmlFor="emailUser">E-Mail:</label>
          <input id="emailUser" name="emailUser" type="email" placeholder="Type here..." required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
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
        <button
          className="button button--secondary"
          onClick={() => navigate("/register")}
        >
          Create an account
        </button>
      </div>
    </main>
  );
}

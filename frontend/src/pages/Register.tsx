import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Register";

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
      <div className="RegisterContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Join the Mia community!</h1>
        <p>Send your first digital message in a bottle 💌</p>
        <form>
          <label htmlFor="firstName">Firstname</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Type here..."
            autoComplete="given-name"
            required
          />
          <label htmlFor="LastName">Lastname:</label>
          <input
            id="LastName"
            name="LastName"
            type="text"
            placeholder="Type here..."
            autoComplete="family-name"
            required
          />
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
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <label htmlFor="passwordConfirm">Confirm Password:</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
          />
        </form>
        <button
          className="button button--primary"
          onClick={() => navigate("/dashboard")}
        >
          Create Account
        </button>
      </div>
    </main>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Register"

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
      <div className="RegisterContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Join the Mia community!</h1>
        <p>Send your first digital message in a bottle 💌</p>
        <form>
          <label htmlFor="firstName">Firstname</label>
          <input id="firstName" name="firstName" type="text" placeholder="Type here..." required />
          <label htmlFor="LastName">Lastname:</label>
          <input id="LastName" name="LastName" type="text" placeholder="Type here..." required />
          <label htmlFor="emailUser">E-Mail:</label>
          <input id="emailUser" name="emailUser" type="email" placeholder="Type here..." required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          <label htmlFor="passwordConfirm">Confirm Password:</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
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

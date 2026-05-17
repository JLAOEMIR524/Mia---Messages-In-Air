import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, useSession } from "../api/auth-client";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("background-heaven");
    document.title = "Mia | Register";

    return () => {
      document.body.classList.remove("background-heaven");
    };
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleSignUp = async () => {
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

    await signUp.email(
      {
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      },
    );
  };

  return (
    <main className="heaven">
      <Link to="/home" className="arrowBack" aria-label="go back">
        <img
          src="./icons/arrow-back.svg"
          alt="Arrow Back Icon"
          aria-hidden="true"
        />
      </Link>
      <div className="RegisterContainer">
        <img src="Logo_without_text.png" alt="Logo Mia" />
        <h1 className="text-s">Join the Mia community!</h1>
        <p>Send your first digital message in a bottle 💌</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <p className="authenticationError">{error}</p>
          <label htmlFor="firstName">Firstname</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Type here..."
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="LastName">Lastname:</label>
          <input
            id="LastName"
            name="LastName"
            type="text"
            placeholder="Type here..."
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="passwordConfirm">Confirm Password:</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
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
      </div>
    </main>
  );
}

import { FeedbackCard } from "../components/SendCards";

export function Details() {
  document.body.classList.add("background-heaven");

  return (
    <main className="heaven">
      <FeedbackCard
        title="Rating - Details"
        topIconSrc="./icons/grading-white.svg"
        message={
          <>
            <p>Length of Poscard: 3/5</p>
            <p>Bad words: 1/5</p>
            <p>Capitalisation: 4/5</p>
            <p>Punctuation: 2/5</p>
            <h5>Quest Fullfillment:</h5>
            <p>Punkt 1: 4/5</p>
            <p>Punkt 2: 2/5</p>
            <p>Punkt 3: 3/5</p>
          </>
        }
        xpAmount={30}
        onContinue={() => window.location.href = "/dashboard"}
      />
    </main>
  );
}

import { FeedbackCard } from "../components/SendCards";

export function Send() {
  return (
      <main className="home">
        <FeedbackCard 
  title="Postcard Sent"
  message={<>Here comes a different text<br/>depending on the score.</>}
  rating={3} 
  xpAmount={30}
  onContinue={() => console.log("Weiter geht's!")}
  onSeeDetails={() => console.log("Details anzeigen...")}
/>
      </main>
  );
}

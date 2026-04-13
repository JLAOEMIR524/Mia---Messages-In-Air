import { Step } from "../components/Step";
import { QuestCard } from "../components/QuestCard";

export function Quest() {
  const handleReload = () => {
    console.log("Quest wird neu geladen...");
  };

  const handleContinue = () => {
    console.log("Quest wurde ausgewählt!");
  };

  return (
    <main>
      <Step currentStep={1} totalSteps={3} />
        <h2>Choose Your Creative Quest ✨</h2>
        <p>Each quest inspires your postcard and makes it special</p>

      <QuestCard 
        title="Same Start"
        description="Write a postcard where at least 5 words start with the same letter."
        onReload={handleReload}
        onContinue={handleContinue}
      />
    </main>
  );
}
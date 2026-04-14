import { Step } from "../components/Step";
import { QuestCard } from "../components/QuestCard";
import { BadgeCard } from "../components/BadegeCard";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Quest() {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

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

      <h2>Or choose from other quests:</h2>
      <BadgeCard
        title="Three Must-Haves"
        description="Use these 3 words somewhere in your postcard: sun, window, train."
        isSelected={selectedBadge === "first"}
        onSelect={() => setSelectedBadge("first")}
      />
      <BadgeCard
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
        isSelected={selectedBadge === "second"}
        onSelect={() => setSelectedBadge("second")}
      />
      <BadgeCard
        title="Question Mark"
        description="Include at least 2 questions in your postcard."
        isSelected={selectedBadge === "third"}
        onSelect={() => setSelectedBadge("third")}
      />

      <Link to="/editor" style={{ textDecoration: "none", border: "none", marginTop: "2.5rem" }}>
        <button className="button button--image">
          Continue to Editor
          <span className="icon-span"></span>
        </button>
      </Link>
    </main>
  );
}

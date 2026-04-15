import { useEffect, useState } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";
import { type Quest as QuestType } from "../api/mockQuest";

export function Message() {
  const [questText, setQuestText] = useState(() => {
    return localStorage.getItem("currentPostcardText") || "";
  });
  const [selectedQuest, setSelectedQuest] = useState<QuestType | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setQuestText(newText);
    localStorage.setItem("currentPostcardText", newText);
  };

  useEffect(() => {
    const savedQuest = localStorage.getItem("selectedQuest");
    if (savedQuest) {
      try {
        setSelectedQuest(JSON.parse(savedQuest));
      } catch (error) {
        console.error("Error parsing quest from localStorage", error);
      }
    }
  }, []);

  return (
    <main>
      <Step currentStep={3} totalSteps={3} />
      <h2>Write Your Message 💌</h2>
      <p>Share your thoughts with a stranger somewhere in the world</p>

      <div className="container-messages">
        {selectedQuest ? (
          <BadgeCard
            title={selectedQuest.title}
            description={selectedQuest.description}
          />
        ) : (
          <p>No quest selected.</p>
        )}
        <div className="flexbox">
          <h4>Your Message</h4>
          <textarea
            className="quest-textarea"
            value={questText}
            onChange={handleTextChange}
            placeholder="Write something ..."
            rows={5}
            required
            minLength={5}
            maxLength={300}
          />
          <p>Characters: {questText.length}/300</p>
        </div>
        <div className="flexbox">
          <h4>Where are you writing from?</h4>
          <search className="search-container">
            <form className="search-form">
              <div className="input-wrapper">
                <input
                  name="fsrch"
                  id="fsrch"
                  placeholder="Search Region..."
                  required
                />
                <img
                  src="./icons/search.svg"
                  alt="Search"
                  className="search-icon"
                />
              </div>
            </form>
          </search>
        </div>
        <BadgeCard
          title="✨ Tips for more XP:"
          description={
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>✓ Read the task carefully and follow all rules</li>
              <li>✓ Write a long enough text</li>
              <li>✓ Avoid bad or inappropriate words</li>
              <li>✓ Use correct capitalisation</li>
              <li>✓ Pay attention to punctuation</li>
            </ul>
          }
        />
      </div>
      <div className="button-flex">
        <button className="button button--image">
          <span className="icon-span"></span>
          Full Screen Preview
        </button>
        <button className="button button--image">
          Send Postcard
          <span className="icon-span"></span>
        </button>
      </div>
    </main>
  );
}

import { useState } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";

export function Message() {
  const [questText, setQuestText] = useState("");

  return (
    <main>
      <Step currentStep={3} totalSteps={3} />
      <h2>Write Your Message 💌</h2>
      <p>Share your thoughts with a stranger somewhere in the world</p>

      <div className="container-messages">
        <BadgeCard
          title="Same Start"
          description="Write a postcard where at least 5 words start with the same letter."
        />
        <div className="flexbox">
          <h4>Your Message</h4>
          <textarea
            className="quest-textarea"
            value={questText}
            onChange={(e) => setQuestText(e.target.value)}
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
          Continue to Text
          <span className="icon-span"></span>
        </button>
      </div>
    </main>
  );
}

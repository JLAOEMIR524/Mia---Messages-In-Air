import { useState, useEffect } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";
import data from "../api/cities.json";
import { Link, useNavigate } from "react-router-dom";

export function Message() {
  const [questText, setQuestText] = useState("");
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const savedQuest = localStorage.getItem("selectedQuest");
    if (savedQuest) {
      setSelectedQuest(JSON.parse(savedQuest));
    }
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
      setSearchTerm(savedLocation);
    }

    const savedText = localStorage.getItem("currentPostcardText");
    if (savedText) {
      setQuestText(savedText);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestText(e.target.value);
    localStorage.setItem("currentPostcardText", questText);
  };

  const allLocations = [
    ...data.cities.map((c) => ({ name: c.name, type: "City" })),
    ...data.countries.map((c) => ({ name: c.name, type: "Country" })),
  ];

  const filteredResults = allLocations
    .filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        searchTerm.length > 0 &&
        !selectedLocation,
    )
    .slice(0, 8);

  const handleSelect = (name: string) => {
    setSelectedLocation(name);
    setSearchTerm(name);
    setShowDropdown(false);
    localStorage.setItem("selectedLocation", name);
  };

  return (
    <main>
      <button onClick={handleBack} className="StepBack left">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </button>
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
            minLength={100}
            maxLength={500}
          />
          <p>Characters: {questText.length}/500</p>
        </div>
        <div className="flexbox">
          <h4>Where are you writing from?</h4>
          <div className="search-container" style={{ position: "relative" }}>
            <div className="input-wrapper">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedLocation(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search City or Country..."
                required
              />
              <img
                src="./icons/search.svg"
                alt="Search"
                className="search-icon"
              />
            </div>

            {showDropdown && filteredResults.length > 0 && (
              <ul className="search-results">
                {filteredResults.map((loc, index) => (
                  <li key={index} onClick={() => handleSelect(loc.name)}>
                    {loc.name} <small>({loc.type})</small>
                  </li>
                ))}
              </ul>
            )}

            {!selectedLocation &&
              searchTerm.length > 2 &&
              filteredResults.length === 0 && (
                <p style={{ color: "var(--color-primary)", fontSize: "1rem" }}>
                  Location not found.
                </p>
              )}
          </div>
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
      {questText.length < 100 && (
        <p className="warning">Your Message is too short :(</p>
      )}
      <div className="button-flex">
        <button className="button button--image">
          <span className="icon-span"></span>
          Preview
        </button>

        <Link to="/send" state={{ fromMessage: true }} style={{ textDecoration: "none", border: "none" }}>
          <button
            className="button button--image message"
            disabled={!selectedLocation || questText.length < 100}
          >
            Send Postcard
            <span className="icon-span"></span>
          </button>
        </Link>
      </div>
    </main>
  );
}

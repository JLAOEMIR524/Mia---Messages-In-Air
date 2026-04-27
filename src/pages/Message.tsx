import { useState, useEffect } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";
import data from "../api/cities.json";
import { Link, useNavigate } from "react-router-dom";
import { Preview } from "../components/Preview";

export function Message() {
  const [questText, setQuestText] = useState("");
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Writing Message";

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
    const newText = e.target.value;
    setQuestText(newText);
    localStorage.setItem("currentPostcardText", newText);
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

  const isDisabled = !selectedLocation || questText.length < 100;

  return (
    <>
      <main>
        <Link to="#" onClick={handleBack} className="StepBack left">
          <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
        </Link>
        <Step currentStep={3} totalSteps={3} />
        <h1 className="text-l">Write Your Message 💌</h1>
        <p>Share your thoughts with a stranger somewhere in the world</p>

        <form
          className="container-messages"
          onSubmit={(e) => e.preventDefault()}
        >
          {selectedQuest ? (
            <BadgeCard
              headingLevel="h2"
              title={selectedQuest.title}
              description={selectedQuest.description}
            />
          ) : (
            <p>No quest selected.</p>
          )}
          <div className="flexbox">
            <label htmlFor="message-text">
              <h2 className="text-s">
                Your Message <span>(min. 100 Characters)</span>
              </h2>
            </label>
            <textarea
              id="message-text"
              className="quest-textarea"
              value={questText}
              onChange={handleTextChange}
              autoComplete="off"
              placeholder="Write something ..."
              rows={5}
              required
              minLength={100}
              maxLength={700}
            />
            <p>Characters: {questText.length}/700</p>
          </div>
          <div className="flexbox">
            <label htmlFor="location-search">
              <h2 className="text-s">Where are you writing from?</h2>
            </label>
            <div className="search-container" style={{ position: "relative" }}>
              <div className="input-wrapper">
                <input
                  id="location-search"
                  type="text"
                  autoComplete="off"
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
                <ul className="search-results" role="listbox">
                  {filteredResults.map((loc, index) => (
                    <li
                      key={index}
                      role="option"
                      tabIndex={0}
                      onClick={() => handleSelect(loc.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSelect(loc.name);
                        }
                      }}
                      className="search-result-item"
                    >
                      {loc.name} <small>({loc.type})</small>
                    </li>
                  ))}
                </ul>
              )}

              {!selectedLocation &&
                searchTerm.length > 2 &&
                filteredResults.length === 0 && (
                  <p
                    style={{ color: "var(--color-primary)", fontSize: "1rem" }}
                  >
                    Location not found.
                  </p>
                )}
            </div>
          </div>
          <BadgeCard
            headingLevel="h2"
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
        </form>
        {questText.length < 100 && (
          <p className="warning">Your Message is too short</p>
        )}
        {!selectedLocation && (
          <p className="warning">Please select a Location</p>
        )}
        <div className="button-flex">
          <button
            className="button button--image"
            onClick={() => setShowPreview(true)}
          >
            <span className="icon-span"></span>
            Preview
          </button>

          <Link
            to="/send"
            state={{ fromMessage: true }}
            className={`button button--image message ${isDisabled ? "is-disabled" : ""}`}
            aria-disabled={isDisabled}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault();
              }
            }}
          >
            Send Postcard
            <span className="icon-span"></span>
          </Link>
        </div>
      </main>
      <Preview isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </>
  );
}

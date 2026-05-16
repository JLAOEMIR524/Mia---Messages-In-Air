import { useState, useEffect } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";
import data from "../api/cities.json";
import { Link, useNavigate } from "react-router-dom";
import { Preview } from "../components/Preview";
import { fetchAdress, type Adress } from "../api/mockAdress";
import { type Quest as QuestType } from "../api/mockQuest";

export function Message() {
  const [questText, setQuestText] = useState<string>(
    () => localStorage.getItem("currentPostcardText") ?? "",
  );

  const [selectedQuest] = useState<QuestType | null>(() => {
    const saved = localStorage.getItem("selectedQuest");
    return saved ? (JSON.parse(saved) as QuestType) : null;
  });

  const [selectedLocation, setSelectedLocation] = useState<string | null>(() =>
    localStorage.getItem("selectedLocation"),
  );

  const [searchTerm, setSearchTerm] = useState<string>(
    () => localStorage.getItem("selectedLocation") ?? "",
  );

  const [showPreview, setShowPreview] = useState(false);
  const [adress, setAdress] = useState<Adress | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [isSending, setIsSending] = useState(false);

  const cardFrontData = localStorage.getItem("card");
  const cardText = localStorage.getItem("currentPostcardText");
  const cardLocation = localStorage.getItem("selectedLocation");

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Writing Message";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const adress = await fetchAdress();
        setAdress(adress);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadData();
  }, []);

  const handleSendPostcard = async () => {
    if (isDisabled || isSending) return;

    try {
      setIsSending(true);

      const postcardPayload = {
        questId: selectedQuest?.id,
        // userId: loggedInUser.id,
        image: localStorage.getItem("card"),
        text: questText,
        location: selectedLocation,
        receiverAddress: adress
      };

      const response = await fetch("http://localhost:3001/api/postcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postcardPayload),
      });

      if (!response.ok) {
        throw new Error("Error saving the postcard.");
      }

      const result = await response.json();
      console.log("Postcard successfully saved:", result);

      localStorage.removeItem("selectedQuest");
      localStorage.removeItem("card");
      localStorage.removeItem("currentPostcardText");
      localStorage.removeItem("selectedLocation");

      navigate("/send", { state: { fromMessage: true } });

    } catch (error) {
      console.error("Error while sending:", error);
      alert("An error occurred while sending the postcard. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isDisabled = !selectedLocation || questText.length < 100 || isSending;

  return (
    <>
      <main>
        <Link
          to="#"
          onClick={handleBack}
          className="StepBack left"
          aria-label="go back"
        >
          <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
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
                  alt=""
                  className="search-icon"
                  aria-hidden="true"
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
        <div aria-live="polite">
          {questText.length < 100 && (
            <p id="msg-warning" className="warning">
              Your Message is too short
            </p>
          )}
          {!selectedLocation && (
            <p id="loc-warning" className="warning">
              Please select a Location
            </p>
          )}
        </div>
        <div className="button-flex">
          <button
            className="button button--image"
            onClick={() => setShowPreview(true)}
            aria-label="Preview the postcard"
          >
            <span className="icon-span"></span>
            Preview
          </button>

          <button
            type="button"
            aria-describedby={
              (questText.length < 100 ? "msg-warning " : "") +
              (!selectedLocation ? "loc-warning" : "")
            }
            className={`button button--image message ${isDisabled ? "is-disabled" : ""}`}
            disabled={isDisabled}
            onClick={handleSendPostcard}
          >
            {isSending ? "Sending..." : "Send Postcard"}
            <span className="icon-span"></span>
          </button>
        </div>
      </main>
      <Preview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Preview"
      >
        {cardFrontData && (
          <img
            src={cardFrontData}
            className="postcardFront"
            alt="Your Postcard"
          />
        )}
        {cardText && cardLocation && adress && (
          <div className="postcardBack">
            <p className="message">{cardText}</p>
            <img src="./Stamp.png" alt="Postal stamp" />
            <div className="adress">
              <p>{adress.name}</p>
              <p>{adress.street}</p>
              <p>
                {adress.zip} {adress.city}
              </p>
              <p>{adress.country}</p>
            </div>
          </div>
        )}
      </Preview>
    </>
  );
}
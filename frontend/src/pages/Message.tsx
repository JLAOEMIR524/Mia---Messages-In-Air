import { useState, useEffect } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { Step } from "../components/Step";
import { Link, useNavigate } from "react-router-dom";
import { Preview } from "../components/Preview";
import {
  fetchRandomAddressFromDB,
  searchLocationsFromDB,
  type AddressType,
  type LocationSuggestion,
} from "../api/locationApi";
import { usePreview } from "../hooks/usePreview";

export interface QuestType {
  id: number;
  title: string;
  description: string;
  xp: number;
}

export function Message() {
  const [announcement, setAnnouncement] = useState("");
  const { previewOpen, setPreviewOpen } = usePreview();
  const [greetingText, setGreetingText] = useState<string>(
    () => localStorage.getItem("currentPostcardGreeting") ?? "",
  );

  const [questText, setQuestText] = useState<string>(
    () => localStorage.getItem("currentPostcardText") ?? "",
  );

  const [selectedQuest, setSelectedQuest] = useState<QuestType | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedQuest");
    if (saved) {
      try {
        setSelectedQuest(JSON.parse(saved) as QuestType);
      } catch (e) {
        console.error("Error parsing the quest:", e);
      }
    }
  }, []);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(() =>
    localStorage.getItem("selectedLocation"),
  );

  const [searchTerm, setSearchTerm] = useState<string>(
    () => localStorage.getItem("selectedLocation") ?? "",
  );

  const [showPreview, setShowPreview] = useState(false);
  const [adress, setAdress] = useState<AddressType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPreviewFromSend, setIsPreviewFromSend] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationSuggestion[]>([]);

  const cardFrontData = localStorage.getItem("card");
  const cardText = localStorage.getItem("currentPostcardText");
  const cardLocation = localStorage.getItem("selectedLocation");
  const cardGreeting = localStorage.getItem("currentPostcardGreeting");

  const shortQuestIds = [8, 10, 14, 16, 24, 30, 36, 49, 59, 62, 68];
  const isShortQuest = selectedQuest
    ? shortQuestIds.includes(Number(selectedQuest.id))
    : false;
  const minRequiredLength = isShortQuest ? 10 : 100;

  const isDisabled =
    !selectedLocation ||
    questText.length < minRequiredLength ||
    !greetingText.trim() ||
    isSending;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Writing Message";
  }, []);

  const handleGreetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGreeting = e.target.value;
    setGreetingText(newGreeting);
    localStorage.setItem("currentPostcardGreeting", newGreeting);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newText = e.target.value;

    if (newText.includes("\n")) {
      const lines = newText.split("\n");

      // Only apply the cleaning logic if there's actual multiline text
      if (lines.length > 1) {
        // Define how many line breaks we allow at the very end (3 breaks = up to 4 lines)
        const maxAllowedBreaks = 3;

        // Separate the main body lines from the protected sign-off lines at the end
        const mainBodyLines = lines.slice(0, -(maxAllowedBreaks + 1));
        const closingLines = lines.slice(-(maxAllowedBreaks + 1));

        // It keeps a line only if it has text, or if it's empty but the previous line wasn't
        const cleanedMainBody = mainBodyLines
          .filter((line, index, arr) => {
            return (
              line.trim() !== "" || (index > 0 && arr[index - 1].trim() !== "")
            );
          })
          .join("\n");

        // Reassemble the text by putting the cleaned body and the closing lines back together
        if (mainBodyLines.length > 0) {
          // Prevent adding a double break if the body already ends with a break or closing starts empty
          const separator =
            cleanedMainBody.endsWith("\n") || closingLines[0] === ""
              ? ""
              : "\n";
          newText = cleanedMainBody + separator + closingLines.join("\n");
        } else {
          newText = closingLines.join("\n");
        }
      }

      newText = newText.replace(/\n{3,}/g, "\n\n");
    }

    const prevLength = questText.length;
    const newLength = newText.length;

    if (prevLength < minRequiredLength && newLength >= minRequiredLength) {
      setAnnouncement(`Minimum of ${minRequiredLength} characters reached.`);
    } else if (
      prevLength >= minRequiredLength &&
      newLength < minRequiredLength
    ) {
      setAnnouncement(`Below minimum length.`);
    }

    setQuestText(newText);
    localStorage.setItem("currentPostcardText", newText);
  };

  useEffect(() => {
    const triggerSearch = async () => {
      if (searchTerm.length > 0 && !selectedLocation) {
        try {
          const results = await searchLocationsFromDB(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error loading locations:", error);
        }
      }
    };

    const delayDebounce = setTimeout(() => {
      triggerSearch();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedLocation]);

  const handleSelect = (name: string) => {
    setSelectedLocation(name);
    setSearchTerm(name);
    setShowDropdown(false);
    localStorage.setItem("selectedLocation", name);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const dbAddress = await fetchRandomAddressFromDB();
        setAdress(dbAddress);
      } catch (error) {
        console.error("Error loading address from DB:", error);
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
        image: localStorage.getItem("card"),
        greeting: greetingText,
        text: questText,
        location: selectedLocation,
        receiverAddress: adress,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/postcards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(postcardPayload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error saving the postcard.");
      }

      console.log("Postcard successfully saved:", result);

      localStorage.removeItem("selectedQuest");
      localStorage.removeItem("card");
      localStorage.removeItem("currentPostcardGreeting");
      localStorage.removeItem("currentPostcardText");
      localStorage.removeItem("selectedLocation");

      navigate("/send", {
        state: {
          fromMessage: true,
          analysis: result.analysis,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error while sending:", error);
        alert(`Validation Error: ${error.message}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isSending) {
    return (
      <div className="full-page-loading">
        <p>Checking content & sending... ⏳</p>
      </div>
    );
  }

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      <main inert={previewOpen ? true : undefined}>
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
        <p className="center-text">
          Share your thoughts with a stranger somewhere in the world. We
          provided some tipps for you - make sure to read them.
        </p>

        <form
          className="container-messages"
          onSubmit={(e) => e.preventDefault()}
        >
          {selectedQuest ? (
            <BadgeCard
              headingLevel="h2"
              xp={selectedQuest.xp}
              title={selectedQuest.title}
              description={selectedQuest.description}
            />
          ) : (
            <p>No quest selected.</p>
          )}
          <div className="flexbox">
            <label htmlFor="message-greeting">
              <h2 className="text-s">Greeting / Subject</h2>
            </label>
            <input
              id="message-greeting"
              type="text"
              className="quest-textarea"
              value={greetingText}
              onChange={handleGreetingChange}
              autoComplete="off"
              placeholder="e.g. Dear Stranger, / Hello from Vienna!"
              required
              minLength={2}
              maxLength={20}
            />
            <label htmlFor="message-text">
              <h2 className="text-s">
                Your Message <span>(min. {minRequiredLength} Characters)</span>
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
              minLength={minRequiredLength}
              maxLength={700}
              aria-describedby={
                questText.length > 0 && questText.length < minRequiredLength
                  ? "err-text"
                  : undefined
              }
            />
            <p aria-hidden="true">Characters: {questText.length}/700</p>

            {questText.length > 0 && questText.length < minRequiredLength && (
              <p id="err-text" className="warning caracters">
                Your Message is too short (needs at least {minRequiredLength}{" "}
                characters).
              </p>
            )}
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

              {showDropdown && searchResults.length > 0 && (
                <ul className="search-results" role="listbox">
                  {searchResults.map((loc, index) => (
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
                searchResults.length === 0 && (
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
            title="✨ Tips for a great Postcard:"
            description={
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>✓ Your message must be written in english</li>
                <li>✓ Read the task carefully and follow all rules</li>
                <li>✓ Write a long enough text</li>
                <li>✓ Avoid bad or inappropriate words</li>
                <li>✓ Use correct capitalisation</li>
                <li>✓ Pay attention to punctuation</li>
              </ul>
            }
          />
        </form>
        <div
          id="form-errors"
          role="status"
          aria-live="polite"
          className="warning-container"
        >
          {!greetingText.trim() && (
            <p id="err-greeting" className="warning">
              Please enter a Greeting or Subject.
            </p>
          )}
          {questText.length < minRequiredLength && (
            <p id="err-text-bottom" className="warning">
              Your Message is too short (needs at least {minRequiredLength}{" "}
              characters).
            </p>
          )}
          {!selectedLocation && (
            <p id="err-location" className="warning">
              Please select a Location.
            </p>
          )}
        </div>

        <div className="button-flex">
          <button
            className="button button--image"
            onClick={() => {
              setShowPreview(true);
              setIsPreviewFromSend(false);
              setPreviewOpen(true);
            }}
            aria-label="Preview the postcard"
          >
            <span className="icon-span"></span>
            Preview
          </button>

          <button
            type="button"
            className={`button button--image message ${isDisabled || isSending ? "is-disabled" : ""}`}
            aria-disabled={isDisabled || isSending}
            aria-describedby={
              [
                !greetingText.trim() ? "err-greeting" : "",
                questText.length < minRequiredLength ? "err-text-bottom" : "",
                !selectedLocation ? "err-location" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onClick={(e) => {
              if (isDisabled || isSending) {
                e.preventDefault();
                return;
              }
              setIsPreviewFromSend(true);
              setShowPreview(true);
              setPreviewOpen(true);
            }}
          >
            Send Postcard <span className="icon-span"></span>
          </button>
        </div>
      </main>
      <Preview
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewOpen(false);
          setIsPreviewFromSend(false);
        }}
        title={isPreviewFromSend ? "Final Review" : "Preview"}
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
            <div className="message-container">
              {cardGreeting && <p className="greeting">{cardGreeting}</p>}
              <p className="message">{cardText}</p>
            </div>

            <img src="./Stamp.png" alt="Postal stamp" />
            <div className="adress">
              <p className="text-bold">To:</p>
              <p>{adress.name}</p>
              <p>{adress.street}</p>
              <p>
                {adress.zip} {adress.city}
              </p>
              <p>{adress.country}</p>
            </div>
          </div>
        )}
        {isPreviewFromSend && (
          <div
            className="previewActions"
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className={`button button--image message ${isDisabled || isSending ? "is-disabled" : ""}`}
              aria-disabled={isDisabled || isSending}
              onClick={(e) => {
                if (isDisabled || isSending) {
                  e.preventDefault();
                  return;
                }
                handleSendPostcard();
              }}
            >
              Confirm & Send Now <span className="icon-span"></span>
            </button>
          </div>
        )}
      </Preview>
    </>
  );
}

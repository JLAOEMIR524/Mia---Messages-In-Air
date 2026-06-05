import { useState, useEffect, useMemo } from "react";
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
import { Popup } from "../components/Popup";
import { cleanPostcardtext } from "../helpers/cleanPostcardText";

//Interfaces
interface QuestType {
  id: number;
  title: string;
  description: string;
  xp: number;
}

//Parameters
const LOAD_WAIT_TIME = 5;
const actions = [
  "Sending Postcard ...",
  "Spellchecking ...",
  "Language Detection ...",
  "Quest Evaluation ...",
  "Picking Recipient ...",
];
const shortQuestIds = [8, 10, 14, 16, 24, 30, 36, 49, 59, 62, 68];

export function Message() {
  const [ariaLiveAnnouncement, setAriaLiveAnnouncement] = useState("");

  const { previewOpen, setPreviewOpen } = usePreview();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [greetingText, setGreetingText] = useState<string>(
    () => localStorage.getItem("currentPostcardGreeting") ?? "",
  );
  const selectedQuest = useMemo<QuestType | null>(() => {
    const saved = localStorage.getItem("selectedQuest");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as QuestType;
    } catch (e) {
      console.error("Error while parsing the quest:", e);
      return null;
    }
  }, []);
  const [cardText, setCardText] = useState<string>(
    () => localStorage.getItem("currentPostcardText") ?? "",
  );
  const [cardFrontData] = useState(() => localStorage.getItem("card"));

  const [selectedLocation, setSelectedLocation] = useState<string | null>(() =>
    localStorage.getItem("selectedLocation"),
  );

  const [searchResults, setSearchResults] = useState<LocationSuggestion[]>([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState<string>(
    () => localStorage.getItem("selectedLocation") ?? "",
  );

  const [adress, setAdress] = useState<AddressType | null>(null);

  const [isSendPreview, setIsSendPreview] = useState(false);

  const isShortQuest = selectedQuest
    ? shortQuestIds.includes(Number(selectedQuest.id))
    : false;
  const minRequiredLength = isShortQuest ? 10 : 100;

  const sendAllowed =
    !selectedLocation ||
    cardText.length < minRequiredLength ||
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
    const newText = cleanPostcardtext(e.target.value);

    const prevLength = cardText.length;
    const newLength = newText.length;

    if (prevLength < minRequiredLength && newLength >= minRequiredLength) {
      setAriaLiveAnnouncement(
        `Minimum of ${minRequiredLength} characters reached.`,
      );
    } else if (
      prevLength >= minRequiredLength &&
      newLength < minRequiredLength
    ) {
      setAriaLiveAnnouncement(`Below minimum length.`);
    }

    setCardText(newText);
    localStorage.setItem("currentPostcardText", newText);
  };

  useEffect(() => {
    const triggerSearch = async () => {
      if (locationSearchTerm.length === 0) {
        setSearchResults([]);
        return;
      }
      if (!selectedLocation) {
        try {
          const results = await searchLocationsFromDB(locationSearchTerm);
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
  }, [locationSearchTerm, selectedLocation]);

  const handleSelect = (name: string) => {
    setSelectedLocation(name);
    setLocationSearchTerm(name);
    setShowSearchDropdown(false);
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
    if (sendAllowed || isSending) return;

    try {
      setIsSending(true);

      const postcardPayload = {
        questId: selectedQuest?.id,
        image: localStorage.getItem("card"),
        greeting: greetingText,
        text: cardText,
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

      setPreviewOpen(false);
      setIsSendPreview(false);

      if (!response.ok) {
        throw new Error(result.error || "Error saving the postcard.");
      }

      //Waits until the loading animation finishes
      await new Promise((resolve) =>
        setTimeout(resolve, LOAD_WAIT_TIME * 1000),
      );

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
        <Popup actions={actions} time={LOAD_WAIT_TIME} />
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
        {ariaLiveAnnouncement}
      </div>
      <main inert={previewOpen}>
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
              value={cardText}
              onChange={handleTextChange}
              autoComplete="off"
              placeholder="Write something ..."
              rows={5}
              required
              minLength={minRequiredLength}
              maxLength={700}
              aria-describedby={
                cardText.length > 0 && cardText.length < minRequiredLength
                  ? "err-text"
                  : undefined
              }
            />
            <p aria-hidden="true">Characters: {cardText.length}/700</p>

            {cardText.length > 0 && cardText.length < minRequiredLength && (
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
                  value={locationSearchTerm}
                  onChange={(e) => {
                    setLocationSearchTerm(e.target.value);
                    setSelectedLocation(null);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
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

              {showSearchDropdown && searchResults.length > 0 && (
                <ul className="search-results" role="listbox">
                  {searchResults.map((loc) => (
                    <li
                      key={`${loc.name}-${loc.type}`}
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
                locationSearchTerm.length > 2 &&
                searchResults.length === 0 && (
                  <p
                    style={{ color: "var(--color-primary)", fontSize: "1rem" }}
                  >
                    Location not found.
                  </p>
                )}
            </div>
          </div>
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
          {cardText.length < minRequiredLength && (
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
              setIsSendPreview(false);
              setPreviewOpen(true);
            }}
            aria-label="Preview the postcard"
          >
            <span className="icon-span"></span>
            Preview
          </button>

          <button
            type="button"
            className={`button button--image message ${sendAllowed || isSending ? "is-disabled" : ""}`}
            aria-disabled={sendAllowed || isSending}
            aria-describedby={
              [
                !greetingText.trim() ? "err-greeting" : "",
                cardText.length < minRequiredLength ? "err-text-bottom" : "",
                !selectedLocation ? "err-location" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onClick={(e) => {
              if (sendAllowed || isSending) {
                e.preventDefault();
                return;
              }
              setIsSendPreview(true);
              setPreviewOpen(true);
            }}
          >
            Send Postcard <span className="icon-span"></span>
          </button>
        </div>
      </main>
      <Preview
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setIsSendPreview(false);
        }}
        title={isSendPreview ? "Final Review" : "Preview"}
      >
        {cardFrontData && (
          <img
            src={cardFrontData}
            className="postcardFront"
            alt="Your Postcard"
          />
        )}
        {cardText && locationSearchTerm && adress && (
          <div className="postcardBack">
            <div className="message-container">
              {greetingText && <p className="greeting">{greetingText}</p>}
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
        {isSendPreview && (
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
              className={`button button--image message ${sendAllowed || isSending ? "is-disabled" : ""}`}
              aria-disabled={sendAllowed || isSending}
              onClick={(e) => {
                if (sendAllowed || isSending) {
                  e.preventDefault();
                  return;
                }
                handleSendPostcard();
              }}
            >
              Confirm & Send Now<span className="icon-span"></span>
            </button>
          </div>
        )}
      </Preview>
    </>
  );
}

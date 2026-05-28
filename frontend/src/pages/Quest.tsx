import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCard } from "../components/BadegeCard";
import { QuestCard } from "../components/QuestCard";
import { Step } from "../components/Step";
import { LoadingBanner } from "../components/LoadingBanner";

export interface QuestType {
  id: number;
  title: string;
  description: string;
  xp: number;
}

export function Quest() {
  const [allQuests, setAllQuests] = useState<QuestType[]>([]);
  const [activeQuest, setActiveQuest] = useState<QuestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<QuestType | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Quest";
    const loadData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/quests`,
        );
        if (!response.ok) throw new Error("Fehler beim Laden der Quests");
        const data = await response.json();

        // Shuffles the incoming quests and sets the first one as active
        const shuffledData = [...data.quests].sort(() => 0.5 - Math.random());
        setAllQuests(shuffledData);
        setActiveQuest(shuffledData[0]);
      } catch (error) {
        console.error("Fehler beim Laden der Quests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Reshuffles the quests when the reload icon is clicked
  const handleReload = () => {
    if (allQuests.length === 0) return;
    const reshuffled = [...allQuests].sort(() => 0.5 - Math.random());
    setAllQuests(reshuffled);
    setActiveQuest(reshuffled[0]);
    setSelectedQuest(null);
  };

  if (loading || !activeQuest) {
    return (
      <LoadingBanner pageName="Gallery"/>
    );
  }

  // Filters out the active focused quest to show 3 alternative options
  const otherQuests = allQuests
    .filter((q) => q.id !== activeQuest.id)
    .slice(0, 3);

  // Saves the chosen quest to local storage and redirects to the editor
  const saveAndNavigate = (quest: QuestType) => {
    localStorage.setItem("selectedQuest", JSON.stringify(quest));
    navigate("/editor", { state: { fromQuest: true } });
  };

  return (
    <main>
      <Link
        to="#"
        onClick={handleBack}
        className="StepBack left"
        aria-label="go back"
      >
        <img
          src="./icons/arrow-back.svg"
          alt="Arrow Back Icon"
          aria-hidden="true"
        />
      </Link>
      <Step currentStep={1} totalSteps={3} />

      <h1 className="text-l">Choose Your Creative Quest ✨</h1>
      <p className="center-text">Each quest inspires the message of your postcard and makes it special</p>

      <QuestCard
        title={activeQuest.title}
        xp={activeQuest.xp}
        description={activeQuest.description}
        onReload={handleReload}
        isSelected={selectedQuest?.id === activeQuest.id}
        onSelect={() => setSelectedQuest(activeQuest)}
        onContinue={() => saveAndNavigate(activeQuest)}
      />
      <h2 className="text-m">Or choose from other quests:</h2>

      <div className="badge-list">
        {otherQuests.map((q) => (
          <BadgeCard
            key={q.id}
            title={q.title}
            xp={q.xp}
            description={q.description}
            isSelected={selectedQuest?.id === q.id}
            onSelect={() => {
              setSelectedQuest(q);
            }}
          />
        ))}
      </div>

      <div aria-live="polite">
        {!selectedQuest && (
          <p id="quest-warning" className="warning">
            Please select a quest to continue
          </p>
        )}
      </div>

      {!selectedQuest ? (
        <button
          className="button button--image"
          aria-describedby="quest-warning"
          disabled
        >
          Continue to Editor
          <span className="icon-span"></span>
        </button>
      ) : (
        <Link
          to="/editor"
          state={{ fromQuest: true }}
          className="button button--image"
          onClick={() =>
            localStorage.setItem("selectedQuest", JSON.stringify(selectedQuest))
          }
        >
          Continue to Editor
          <span className="icon-span"></span>
        </Link>
      )}
    </main>
  );
}

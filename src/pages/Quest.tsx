import { Step } from "../components/Step";
import { QuestCard } from "../components/QuestCard";
import { BadgeCard } from "../components/BadegeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuests, type Quest as QuestType } from "../api/mockQuest";

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
        const data = await fetchQuests();

        const shuffledData = [...data].sort(() => 0.5 - Math.random());

        setAllQuests(shuffledData);
        const initial = shuffledData[0];

        setActiveQuest(initial);
        setSelectedQuest(null);
      } catch (error) {
        console.error("Fehler beim Laden der Quests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleReload = () => {
    const randomIndex = Math.floor(Math.random() * allQuests.length);
    const newQuest = allQuests[randomIndex];
    setActiveQuest(newQuest);
    setSelectedQuest(null);
  };
  if (loading || !activeQuest) {
    return (
      <p
        style={{
          margin: "auto",
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        Loading Quests...
      </p>
    );
  }

  const otherQuests = allQuests
    .filter((q) => q.id !== activeQuest.id)
    .slice(0, 3);

  return (
    <main>
      <Link to="#" onClick={handleBack} className="StepBack left">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </Link>
      <Step currentStep={1} totalSteps={3} />

      <h1 className="text-l">Choose Your Creative Quest ✨</h1>
      <p>Each quest inspires your postcard and makes it special</p>

      <QuestCard
        title={activeQuest.title}
        description={activeQuest.description}
        onReload={handleReload}
        isSelected={selectedQuest?.id === activeQuest.id}
        onSelect={() => setSelectedQuest(activeQuest)}
        onContinue={() => {
          localStorage.setItem("selectedQuest", JSON.stringify(activeQuest));
          navigate("/editor", { state: { fromQuest: true } });
        }}
      />
      <h2 className="text-m">Or choose from other quests:</h2>

      <div className="badge-list">
        {otherQuests.map((q) => (
          <BadgeCard
            key={q.id}
            title={q.title}
            description={q.description}
            isSelected={selectedQuest?.id === q.id}
            onSelect={() => setSelectedQuest(q)}
          />
        ))}
      </div>

      {!selectedQuest && (
        <p className="warning">Please select a quest to continue</p>
      )}
      {!selectedQuest ? (
        <button className="button button--image" disabled>
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

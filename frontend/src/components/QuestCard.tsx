import { Link } from "react-router-dom";

interface QuestCardProps {
  title: string;
  description: string;
  onReload: () => void;
  onContinue: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function QuestCard({
  title,
  description,
  onReload,
  onContinue,
  isSelected,
  onSelect,
}: QuestCardProps) {
  return (
    <div
      className={`loadQuestCard ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="reloadHeadline">
        <h2 className="text-s">{title}</h2>
        <button
          className="iconButton"
          aria-label="Reload Quest"
          onClick={(e) => {
            // Stops the card's onClick from firing when clicking reload
            e.stopPropagation();
            onReload();
          }}
        >
          <img src="./icons/reload_white.svg" alt="" aria-hidden="true" />
        </button>
      </div>

      <p>{description}</p>

      {/* Sends a state flag to the editor route so it knows user came from a quest */}
      <Link
        to="/editor"
        state={{ fromQuest: true }}
        className="button"
        onClick={onContinue}
      >
        Choose This Quest
      </Link>
    </div>
  );
}

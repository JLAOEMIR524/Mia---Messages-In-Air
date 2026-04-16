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
        <h4>{title}</h4>
        <button
          className="iconButton"
          aria-label="Reload Quest"
          onClick={(e) => {
            e.stopPropagation();
            onReload();
          }}
        >
          <img aria-hidden="true" src="./icons/reload_white.svg" alt="Reload" />
        </button>
      </div>

      <p>{description}</p>

      <button className="button" onClick={onContinue}>
        Choose This Quest
      </button>
    </div>
  );
}

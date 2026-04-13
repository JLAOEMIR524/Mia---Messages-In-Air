interface QuestCardProps {
  title: string;
  description: string;
  onReload: () => void;
  onContinue: () => void;
}

export function QuestCard({ title, description, onReload, onContinue }: QuestCardProps) {
  return (
    <div className="loadQuestCard">
      <div className="reloadHeadline">
        <h4>{title}</h4>
        <button 
          className="iconButton" 
          aria-label="Reload Quest"
          onClick={onReload}
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
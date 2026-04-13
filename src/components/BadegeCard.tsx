interface BadgeCardProps {
  title: string;
  description: string;
  icon?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function BadgeCard({ title, description, icon, isSelected, onSelect }: BadgeCardProps) {
  return (
    <div 
      className={`questCard ${isSelected ? "selected" : ""}`} 
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      {icon && (
        <img src={icon} alt={`${title} icon`} aria-hidden="true" />
      )}
      
      <hgroup>
        <h4>{title}</h4>
        <p className="text--small">{description}</p>
      </hgroup>
    </div>
  );
}
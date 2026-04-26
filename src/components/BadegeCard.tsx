import { type ReactNode } from 'react';

interface BadgeCardProps {
  title: string;
  description: ReactNode;
  icon?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function BadgeCard({ title, description, icon, isSelected, onSelect }: BadgeCardProps) {
  return (
    <div 
      className={`questCard ${isSelected ? "selected" : ""}`} 
      onClick={onSelect}
    >
      {icon && (
        <img src={icon} alt={`${title} icon`} aria-hidden="true" />
      )}
      
      <hgroup>
        <h4>{title}</h4>
        <div className="text--small">{description}</div>
      </hgroup>
    </div>
  );
}
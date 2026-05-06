import { type ReactNode } from "react";

interface BadgeCardProps {
  title: string;
  description: ReactNode;
  icon?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  headingLevel?: "h2" | "h3" | "h4";
}

export function BadgeCard({
  title,
  description,
  icon,
  isSelected,
  onSelect,
  headingLevel: Tag = "h3",
}: BadgeCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onSelect && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`questCard ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      aria-pressed={onSelect ? isSelected : undefined}
    >
      {icon && <img src={icon} alt="" aria-hidden="true" />}

      <hgroup>
        <Tag className="text-xs">{title}</Tag>
        <div className="text--small">{description}</div>
      </hgroup>
    </div>
  );
}

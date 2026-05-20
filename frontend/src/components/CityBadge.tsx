interface CityBadgeProps {
  location: string;
  icon?: string;
}

export function CityBadge({
  location,
  icon = "./icons/location-white.svg",
}: CityBadgeProps) {
  return (
    <div className="city">
      <img src={icon} alt="" className="city__icon" aria-hidden="true" />
      <span className="city__text">{location}</span>
    </div>
  );
}

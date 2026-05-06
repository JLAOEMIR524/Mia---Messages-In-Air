interface CityBadgeProps {
  city: string;
  country: string;
  icon?: string;
}

export function CityBadge({
  city,
  country,
  icon = "./icons/location-white.svg",
}: CityBadgeProps) {
  return (
    <div className="city">
      <img src={icon} alt="" className="city__icon" aria-hidden="true" />
      <span className="city__text">
        {city}, {country}
      </span>
    </div>
  );
}

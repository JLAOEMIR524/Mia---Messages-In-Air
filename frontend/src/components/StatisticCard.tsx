interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export function StatisticCard({ title, value, icon }: StatisticCardProps) {
  return (
    <div className="statisticCard">
      <div>
        <img src={icon} alt="" aria-hidden="true" />
        <p>{title}</p>
      </div>
      <p className="text-s">{value}</p>
    </div>
  );
}

import { ProfileTopper } from "../components/ProfileTopper";

export function Profile() {
  return (
    <main className="left">
      <h2>Your Profile 👤</h2>

      <ProfileTopper
        initials="MM"
        name="Max Mustermann"
        email="maxi@sonnenschein.at"
        memberSince="24.11.2004"
        postcardsSent={254}
        currentXp={342}
        progressPercent={20}
        onEdit={() => console.log("Edit clicked")}
      />

      
    </main>
  );
}

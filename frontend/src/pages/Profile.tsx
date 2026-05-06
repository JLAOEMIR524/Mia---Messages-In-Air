import { useEffect } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { ProfileTopper } from "../components/ProfileTopper";
import SwapCard from "../components/SwapCard";
import { Link, useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
      document.title = "Mia | Profile"
  },[])

  return (
    <main className="left profile">
      <Link to="#" onClick={handleBack} className="StepBack" aria-label="Back">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </Link>
      <h1 className="text-l">Your Profile 👤</h1>

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

      <h2 className="text-m">Your Stickers</h2>
      <h3 className="text-s">Unlocked</h3>

      <div className="stickerComponent">
        <div className="stickerBox">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <SwapCard
              key={num}
              stickerSrc={`./stickers/${num}.avif`}
              description={`Sticker ${num}`}
              xpAmount={2500}
              iconSrc="./icons/check.svg"
            />
          ))}
        </div>
      </div>
      <h3 className="text-s">Upcoming</h3>
      <div className="stickerComponent">
        <div className="stickerBox">
          {Array.from({ length: 26 }, (_, i) => i + 15).map((num) => (
            <SwapCard
              key={num}
              stickerSrc={`./stickers/${num}.avif`}
              description="Locked"
              xpAmount={2500}
              iconSrc="./icons/lock.svg"
              extraClass="stickerCard--locked"
              extraClass2="stickerCard--locked-2"
            />
          ))}
        </div>
      </div>
      <h2 className="margin text-m">Quests</h2>
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
      <BadgeCard
        icon="./icons/star_shine.svg"
        title="Tiny Story"
        description="Tell a complete story in exactly 4 sentences."
      />
    </main>
  );
}

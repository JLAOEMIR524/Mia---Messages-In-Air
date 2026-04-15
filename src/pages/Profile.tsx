import { BadgeCard } from "../components/BadegeCard";
import { ProfileTopper } from "../components/ProfileTopper";
import SwapCard from "../components/SwapCard";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className="left profile">
      <button onClick={handleBack} className="StepBack">
        <img src="./icons/arrow-back.svg" alt="Arrow Back Icon" />
      </button>
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

      <h4>Your Stickers</h4>
      <h5>Unlocked</h5>

      <div className="stickerComponent">
        <div className="stickerBox">
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/check.svg"
          />
        </div>
      </div>
      <h5>Upcoming</h5>
      <div className="stickerComponent">
        <div className="stickerBox">
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
          <SwapCard
            sticker="🚀"
            description="Rocket"
            xpAmount={2500}
            iconSrc="./icons/lock.svg"
            extraClass="stickerCard--locked"
            extraClass2="stickerCard--locked-2"
          />
        </div>
      </div>
      <h4 className="margin">Quests</h4>
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

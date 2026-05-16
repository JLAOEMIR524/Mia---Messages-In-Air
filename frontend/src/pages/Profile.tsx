import { useEffect, useState } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { ProfileTopper } from "../components/ProfileTopper";
import SwapCard from "../components/SwapCard";
import { Link, useNavigate } from "react-router-dom";

interface Sticker {
  id: number;
  name: string;
  stickerSrc: string;
  xpAmount: number;
  isLocked: boolean;
  description: string;
  iconSrc: string;
}

export function Profile() {
  const navigate = useNavigate();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Profile";
  }, []);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/stickers");
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();
        setStickers(data.stickers);
      } catch (err) {
        console.error("Error loading stickers:", err);
        setError("Stickers could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStickers();
  }, []);

  const unlockedStickers = stickers.filter((sticker) => !sticker.isLocked);
  const lockedStickers = stickers.filter((sticker) => sticker.isLocked);

  return (
    <main className="left profile">
      {loading ? (
        <div className="loadingState">Loading Stickers...</div>
      ) : error ? (
        <div className="errorState">{error}</div>
      ) : (
        <>
          <Link
            to="#"
            onClick={handleBack}
            className="StepBack"
            aria-label="go back"
          >
            <img
              src="./icons/arrow-back.svg"
              alt="Arrow Back Icon"
              aria-hidden="true"
            />
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
              {unlockedStickers.map((sticker) => (
                <SwapCard
                  key={sticker.id}
                  stickerSrc={sticker.stickerSrc}
                  description={sticker.name}
                  xpAmount={sticker.xpAmount}
                  iconSrc={sticker.iconSrc}
                />
              ))}
            </div>
          </div>

          <h3 className="text-s">Upcoming</h3>
          <div className="stickerComponent">
            <div className="stickerBox">
              {lockedStickers.map((sticker) => (
                <SwapCard
                  key={sticker.id}
                  stickerSrc={sticker.stickerSrc}
                  description={sticker.name}
                  xpAmount={sticker.xpAmount}
                  iconSrc={sticker.iconSrc}
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
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
          <BadgeCard
            icon="./icons/star_shine.svg"
            title="Tiny Story"
            description="Tell a complete story in exactly 4 sentences."
          />
        </>
      )}
    </main>
  );
}

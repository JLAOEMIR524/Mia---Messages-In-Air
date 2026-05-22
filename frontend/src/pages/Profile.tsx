import { useEffect, useState } from "react";
import { BadgeCard } from "../components/BadegeCard";
import { ProfileTopper } from "../components/ProfileTopper";
import SwapCard from "../components/SwapCard";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../api/auth-client";

interface UserStats {
  postcardsSent: number;
  currentXp: number;
  progressPercent: number;
}

interface Sticker {
  id: number;
  name: string;
  stickerSrc: string;
  xpAmount: number;
  isLocked: boolean;
  description: string;
  iconSrc: string;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  earnedXp: number;
}

export function Profile() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats>({
    postcardsSent: 0,
    currentXp: 0,
    progressPercent: 0,
  });
  const navigate = useNavigate();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userQuests, setUserQuests] = useState<Quest[]>([]);

  const [updatedUser, setUpdatedUser] = useState<{
    firstName?: string;
    lastName?: string;
  } | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Profile";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetches user stats like XP and postcards sent
        const statsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/stats`,
          {
            credentials: "include",
          },
        );

        if (statsRes.ok) {
          const statsData = await statsRes.json();

          if (!statsData.error) {
            const MAX_XP = 4000;
            const userXp = statsData.xp || 0;

            setStats({
              postcardsSent: statsData.sentCount || 0,
              currentXp: userXp,
              progressPercent: Math.min(
                Math.round((userXp / MAX_XP) * 100),
                100,
              ),
            });
          }
        }

        // Fetches all system stickers
        const stickersRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stickers`,
          {
            credentials: "include",
          },
        );
        if (!stickersRes.ok) {
          throw new Error(`Stickers Error status: ${stickersRes.status}`);
        }
        const stickersData = await stickersRes.json();
        setStickers(stickersData.stickers);

        // Fetches all completed quests by the user
        const userQuestsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/quests`,
          {
            credentials: "include",
          },
        );
        if (userQuestsRes.ok) {
          const userQuestsData = await userQuestsRes.json();
          setUserQuests(userQuestsData.quests || []);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Profile data could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [session]);

  // Splits stickers based on lock status
  const unlockedStickers = stickers.filter((sticker) => !sticker.isLocked);
  const lockedStickers = stickers.filter((sticker) => sticker.isLocked);

  // Gets the current values (either newly saved or from the session)
  const currentFirstName = updatedUser?.firstName ?? session?.user?.firstName;
  const currentLastName = updatedUser?.lastName ?? session?.user?.lastName;

  return (
    <main className="left profile">
      {loading ? (
        <div className="loadingState">Loading Profile...</div>
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
            initials={
              currentFirstName && currentLastName
                ? `${currentFirstName.charAt(0).toUpperCase()}${currentLastName.charAt(0).toUpperCase()}`
                : "??"
            }
            name={
              currentFirstName || currentLastName
                ? `${currentFirstName ?? ""} ${currentLastName ?? ""}`
                : "Guest"
            }
            email={session?.user.email}
            memberSince={
              session?.user.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""
            }
            postcardsSent={stats.postcardsSent}
            currentXp={stats.currentXp}
            progressPercent={stats.progressPercent}
            onEdit={async (updatedData) => {
              try {
                // Sends updated profile data to the database
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/user/update`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(updatedData),
                  },
                );

                if (!res.ok) {
                  throw new Error(
                    "Failed to update profile data in the backend",
                  );
                }

                const data = await res.json();
                console.log("Successfully saved to database:", data);

                setUpdatedUser(updatedData);
              } catch (err) {
                console.error("Database update failed:", err);
                alert("Could not save profile data. Please try again later.");
              }
            }}
          />

          <h2 className="text-m">Your Stickers</h2>

          <h3 className="text-s">Unlocked</h3>
          <div className="stickerComponent">
            <div className="stickerBox">
              {unlockedStickers.map((sticker) => (
                <div
                  className="swap-wrapper"
                  key={sticker.id}
                  tabIndex={0}
                  role="img"
                  aria-label={`Unlocked Sticker: ${sticker.name}. Worth ${sticker.xpAmount} XP.`}
                >
                  <SwapCard
                    stickerSrc={sticker.stickerSrc}
                    description={sticker.name}
                    xpAmount={sticker.xpAmount}
                    iconSrc={sticker.iconSrc}
                  />
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-s">Upcoming</h3>
          <div className="stickerComponent">
            <div className="stickerBox">
              {lockedStickers.map((sticker) => (
                <div
                  className="swap-wrapper"
                  key={sticker.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Locked Sticker: ${sticker.name}. Requires ${sticker.xpAmount} XP.`}
                >
                  <SwapCard
                    stickerSrc={sticker.stickerSrc}
                    description={sticker.name}
                    xpAmount={sticker.xpAmount}
                    iconSrc={sticker.iconSrc}
                    extraClass="stickerCard--locked"
                    extraClass2="stickerCard--locked-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <h2 className="margin text-m">
            Completed Quests ({userQuests.length})
          </h2>
          {userQuests.length === 0 ? (
            <p className="noDataState">
              You haven't completed any quests yet. Send a postcard to start!
            </p>
          ) : (
            [...userQuests]
              .reverse()
              .map((quest) => (
                <BadgeCard
                  key={quest.id}
                  icon="./icons/star_shine.svg"
                  title={quest.title}
                  description={`${quest.description} (+${quest.earnedXp} XP)`}
                />
              ))
          )}
        </>
      )}
    </main>
  );
}

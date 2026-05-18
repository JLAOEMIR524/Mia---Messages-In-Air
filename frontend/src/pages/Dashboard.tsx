import { StatisticCard } from "../components/StatisticCard";
import { LinkHeader } from "../components/LinkHeader";
import { MessagePreview } from "../components/MessagePreviewCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "../api/auth-client";

interface BackendPostcard {
  id: number;
  creatorId: string;
  receiverId: string | null;
  location: string;
  text: string;

  creator?: {
    firstName: string;
    lastName: string;
  };

  receiver?: {
    firstName: string;
    lastName: string;
  };
}

export function Dashboard() {
  const { data: session } = useSession();

  // Hier nutzen wir das korrekte Backend-Interface für den State
  const [postcards, setPostcards] = useState<BackendPostcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Mia | Dashboard";

    const fetchPostcards = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/postcards`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Server-Fehler: ${response.status}`);
        }

        const data = await response.json();

        setPostcards(data.postcards || []);
      } catch (err) {
        console.error("Fehler beim Laden der Postkarten:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostcards();
  }, [session]);

  const currentUserId = session?.user?.id;

  const sentCards = postcards.filter(
    (card) => card.creatorId === currentUserId,
  );

  const receivedCards = postcards.filter(
    (card) => card.receiverId === currentUserId,
  );

  const uniqueCountries = new Set(postcards.map((card) => card.location)).size;

  if (loading) {
    return (
      <main className="left">
        <p>Loading Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="left">
      <h1 className="text-l">Hello {session?.user?.firstName} ✨</h1>
      <p>Welcome back to Mia. </p>
      <Link className="newPostcard" to="/quest">
        <img src="./icons/add_circle.svg" alt="" aria-hidden="true" />
        <h2 className="text-m">New Postcard</h2>
        <p>Write a postcard and make someone smile</p>
      </Link>

      <div className="flexbox-statisticCard">
        <StatisticCard
          title="Sent"
          value={sentCards.length.toString()}
          icon="./icons/letter.svg"
        />
        <StatisticCard
          title="Received"
          value={receivedCards.length.toString()}
          icon="./icons/check.svg"
        />
        <StatisticCard
          title="Countries"
          value={uniqueCountries.toString()}
          icon="./icons/flag.svg"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <LinkHeader
            title="Received"
            icon="./icons/letter.svg"
            linkTo="/gallery"
          />
          {receivedCards.length === 0 ? (
            <p>No messages received yet.</p>
          ) : (
            receivedCards
              .slice(0, 3)
              .map((card) => (
                <MessagePreview
                  key={card.id}
                  titel={`Von: ${card.creator?.firstName || "Unbekannt"}`}
                  country={card.location}
                  previewText={card.text}
                  to="/gallery"
                />
              ))
          )}
        </div>

        <div className="dashboard-column">
          <LinkHeader
            title="Sent"
            icon="./icons/letter.svg"
            linkTo="/gallery"
          />
          {sentCards.length === 0 ? (
            <p>No messages sent yet.</p>
          ) : (
            sentCards
              .slice(0, 3)
              .map((card) => (
                <MessagePreview
                  key={card.id}
                  titel={`An: ${card.receiver?.firstName || "Unbekannt"}`}
                  country={card.location}
                  previewText={card.text}
                  statusIcon="./icons/email-white.svg"
                  to="/gallery"
                />
              ))
          )}
        </div>
      </div>
    </main>
  );
}

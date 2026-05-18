import { MapContainer } from "react-leaflet";
import { Card } from "../components/Card";
import type { LatLngExpression } from "leaflet";
import { CityBadge } from "../components/CityBadge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "../api/auth-client";


interface Postcard {
  id: number;
  image: string;
  text: string;
  location: string;
  creatorId: string;
  receiverId: string | null;
  creator: { firstName: string; lastName: string };
  receiver?: { firstName: string; lastName: string } | null;
}

export function Gallery() {
  const position: LatLngExpression = [47.8, 13.04];
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [filter, setFilter] = useState<"all" | "received" | "sent">("all");
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Gallery";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchPostcards = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/api/user/postcards", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPostcards(data.postcards || []);
        }
      } catch (err) {
        console.error("Error loading the postcards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostcards();
  }, [session]);

  const currentUserId = session?.user?.id;

  const filteredPostcards = postcards.filter((card) => {
    if (filter === "sent") {
      return card.creatorId === currentUserId;
    }
    if (filter === "received") {
      return card.receiverId === currentUserId;
    }
    return (
      card.creatorId === currentUserId || card.receiverId === currentUserId
    );
  });

  return (
    <main className="left">
      <Link
        to="#"
        onClick={handleBack}
        className="StepBack"
        aria-label="go back"
      >
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>
      <h1 className="text-l">Your Gallery 🖼️</h1>
      <p>All the postcards you've sent and received</p>
      <div className="button-flex gallery">
        <button
          className={`button button--image ${filter === "all" ? "button--active" : ""}`}
          onClick={() => setFilter("all")}
          aria-label="open all Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          All Postcards
        </button>
        <button
          className={`button button--image ${filter === "received" ? "button--active" : ""}`}
          onClick={() => setFilter("received")}
          aria-label="open received Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Received
        </button>
        <button
          className={`button button--image ${filter === "sent" ? "button--active" : ""}`}
          onClick={() => setFilter("sent")}
          aria-label="open sent Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Sent
        </button>
      </div>

      {loading ? (
        <div className="loadingState">Loading Gallery...</div>
      ) : filteredPostcards.length === 0 ? (
        <p className="noDataState">No postcards found in this category.</p>
      ) : (
        <div className="card-grid">
          {filteredPostcards.map((card) => {
            const isSent = card.creatorId === currentUserId;

            const imageSrc = card.image.startsWith("data:image")
              ? card.image
              : `http://localhost:3001${card.image}`;

            return (
              <Card
                key={card.id}
                image={imageSrc}
                description={
                  <>
                    <p>
                      {isSent
                        ? `To: Someone in the world`
                        : `From: Someone to you`}
                    </p>
                    <p>📍 {card.location}</p>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <h2 className="text-m">Postcard Map</h2>
      <MapContainer center={position} zoom={13}></MapContainer>

      <div className="cityWrapper">
        {Array.from(new Set(filteredPostcards.map((c) => c.location))).map(
          (loc, index) => (
            <CityBadge key={index} location={loc} />
          ),
        )}
      </div>
    </main>
  );
}

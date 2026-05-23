import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card } from "../components/Card";
import type { LatLngExpression } from "leaflet";
import { CityBadge } from "../components/CityBadge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "../api/auth-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Postcard {
  id: number;
  questId: number | null;
  image: string;
  greeting: string;
  text: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  receiverAddress: {
    name: string;
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  xp: number;
  createdAt: string;
  creatorId: string;
  receiverId: string | null;
  creator: { firstName: string; lastName: string };
  receiver?: { firstName: string; lastName: string } | null;
}

const ITEMS_PER_PAGE = 6;

export function Gallery() {
  const position: LatLngExpression = [50.0, 10.0];
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [filter, setFilter] = useState<"all" | "received" | "sent">("all");
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number>(-1);

  const [currentPage, setCurrentPage] = useState(1);

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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/postcards`,
          {
            credentials: "include",
          },
        );
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

  // Resets pagination back to page 1 whenever user switches the filter view
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedPostcards = filteredPostcards.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredPostcards.length / ITEMS_PER_PAGE);

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
          className={`button button--image gallery-filter ${filter === "all" ? "button--primary" : "button--secondary"}`}
          onClick={() => setFilter("all")}
          aria-label="show all Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          All Postcards
        </button>
        <button
          className={`button button--image gallery-filter ${filter === "received" ? "button--primary" : "button--secondary"}`}
          onClick={() => setFilter("received")}
          aria-label="show received Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Received
        </button>
        <button
          className={`button button--image gallery-filter ${filter === "sent" ? "button--primary" : "button--secondary"}`}
          onClick={() => setFilter("sent")}
          aria-label="show sent Postcards"
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
        <>
          <div className="card-grid">
            {paginatedPostcards.map((card) => {
              const isSent = card.creatorId === currentUserId;

              const imageSrc = card.image.startsWith("data:image")
                ? card.image
                : `${import.meta.env.VITE_API_URL}${card.image}`;

              return (
                <div
                  className={`gallery-card-wrapper ${flippedCards === card.id ? "is-flipped" : ""}`}
                  key={card.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={flippedCards === card.id}
                  aria-label={`Postcard ${isSent ? `to ${card.receiverAddress?.name ?? "someone"}` : `from ${card.location}`}. Text: ${card.text}`}
                  onClick={() => setFlippedCards(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFlippedCards(card.id);
                    }
                  }}
                >
                  <Card
                    image={imageSrc}
                    description={
                      <>
                        <span>
                          {isSent
                            ? "To: Someone in the world"
                            : "From: Someone to you"}
                        </span>
                        <br />
                        <span>
                         {" "}
                          {new Date(card.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
                        </span>{" "}
                        <br />
                        <span>📍 {card.location}</span>
                      </>
                    }
                  />

                  <div className="postcard-overlay-back">
                    <div className="postcard-overlay-content">
                      <div className="overlay-message-side">
                        {card.greeting && (
                          <p className="overlay-greeting">{card.greeting}</p>
                        )}
                        <p className="overlay-text">{card.text}</p>
                      </div>

                      <div className="overlay-address-side">
                        <img
                          src="./Stamp.png"
                          alt="Stamp"
                          className="overlay-stamp"
                        />

                        <div className="overlay-address-field">
                          <p className="address-label">
                            <strong>{isSent ? "To:" : "From:"}</strong>
                          </p>

                          {isSent ? (
                            <>
                              <p className="address-line">
                                {card.receiverAddress?.name ??
                                  `${card.receiver?.firstName ?? "Sparkle"} ${card.receiver?.lastName ?? "Twinkletoes"}`}
                              </p>
                              <p className="address-line">
                                {card.receiverAddress?.street ??
                                  "Fireplace Way 4"}
                              </p>
                              <p className="address-line">
                                {card.receiverAddress?.zip &&
                                card.receiverAddress?.city
                                  ? `${card.receiverAddress.zip} ${card.receiverAddress.city}`
                                  : "55555 Hugsville"}
                              </p>
                            </>
                          ) : (
                            (() => {
                              const randomNames = [
                                "Waffle Crispycookie",
                                "Snuggles Warmheart",
                                "Honey Bumblebee",
                                "Pip Shortcake",
                                "Mocha Marshmallow",
                              ];
                              const randomStreets = [
                                "Sunshine Lane 123",
                                "Cozy Corner 7",
                                "Cloud Nine Ave 99",
                                "Rainbow Road 42",
                                "Starlight Boulevard 11",
                              ];
                              const randomCities = [
                                "Hugsville",
                                "Dreamland",
                                "Skytown",
                                "Wonderland",
                                "Chillington",
                              ];
                              const randomZips = [
                                "55555",
                                "77777",
                                "12345",
                                "98765",
                                "44444",
                              ];

                              // Generates consistent placeholder addresses based on the card ID seed
                              const nameIndex = card.id % randomNames.length;
                              const streetIndex =
                                (card.id + 1) % randomStreets.length;
                              const cityIndex =
                                (card.id + 2) % randomCities.length;
                              const zipIndex =
                                (card.id + 3) % randomZips.length;

                              return (
                                <>
                                  <p className="address-line">
                                    {randomNames[nameIndex]}
                                  </p>
                                  <p className="address-line">
                                    {randomStreets[streetIndex]}
                                  </p>
                                  <p className="address-line">
                                    {`${randomZips[zipIndex]} ${card.location ?? randomCities[cityIndex]}`}
                                  </p>
                                </>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                className="button button--secondary"
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }
                }}
                aria-disabled={currentPage === 1}
                aria-label="Go to previous page"
                /* Prevents clicking via the keyboard if disabled */
                tabIndex={currentPage === 1 ? -1 : 0}
              >
                <span aria-hidden="true">◀ </span>Back
              </button>

              <span aria-current="page">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button
                className="button button--secondary"
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }
                }}
                aria-disabled={currentPage === totalPages}
                aria-label="Go to next page"
                tabIndex={currentPage === totalPages ? -1 : 0}
              >
                Next<span aria-hidden="true"> ▶</span>
              </button>
            </nav>
          )}
        </>
      )}

      <h2 className="text-m">Postcard Map</h2>
      <MapContainer center={position} zoom={4}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredPostcards.map((card) => {
          if (
            card.latitude !== null &&
            card.longitude !== null &&
            card.latitude !== undefined &&
            card.longitude !== undefined
          ) {
            return (
              <Marker key={card.id} position={[card.latitude, card.longitude]}>
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <strong>{card.location}</strong>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>

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

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

export function Gallery() {
  const position: LatLngExpression = [50.0, 10.0];
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
          className={`button button--image gallery-filter ${filter === "all" ? "button--primary" : "button--secondary"}`}
          onClick={() => setFilter("all")}
          aria-label="open all Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          All Postcards
        </button>
        <button
          className={`button button--image gallery-filter ${filter === "received" ? "button--primary" : "button--secondary"}`}
          onClick={() => setFilter("received")}
          aria-label="open received Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Received
        </button>
        <button
          className={`button button--image gallery-filter ${filter === "sent" ? "button--primary" : "button--secondary"}`}
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
              <div
                className="gallery-card-wrapper"
                key={card.id}
                tabIndex={0}
                role="article"
                aria-label={`Postcard ${isSent ? `to ${card.receiverAddress?.name ?? "someone"}` : `from ${card.location}`}. Text: ${card.text}`}
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
                      <span>📍 {card.location}</span>
                    </>
                  }
                />

                <div className="postcard-overlay-back">
                  <div className="postcard-overlay-content">
                    <div className="overlay-message-side">
                      {card.greeting && (
                        <p
                          className="overlay-greeting"
                        >
                          {card.greeting}
                        </p>
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

                            const nameIndex = card.id % randomNames.length;
                            const streetIndex =
                              (card.id + 1) % randomStreets.length;
                            const cityIndex =
                              (card.id + 2) % randomCities.length;
                            const zipIndex = (card.id + 3) % randomZips.length;

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

import { MapContainer } from "react-leaflet";
import { Card } from "../components/Card";
import type { LatLngExpression } from "leaflet";
import { CityBadge } from "../components/CityBadge";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "../api/auth-client";

export function Gallery() {
  const position: LatLngExpression = [47.8, 13.04];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Gallery";
  }, []);



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
          className="button button--image"
          aria-label="open all Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          All Postcards
        </button>
        <button
          className="button button--image"
          aria-label="open received Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Received
        </button>
        <button
          className="button button--image"
          aria-label="open sent Postcards"
        >
          <span className="icon-span" aria-hidden="true"></span>
          Send
        </button>
      </div>
      <div className="card-grid">
        <Card
          image="https://placehold.co/400x250"
          description={
            <>
              <p> From: Susanne Musterfrau</p>
              <p>📍San Francisco, USA</p>
            </>
          }
        />
        <Card
          image="https://placehold.co/400x250"
          description={
            <>
              <p> From: Susanne Musterfrau</p>
              <p>📍San Francisco, USA</p>
            </>
          }
        />
        <Card
          image="https://placehold.co/400x250"
          description={
            <>
              <p> From: Susanne Musterfrau</p>
              <p>📍San Francisco, USA</p>
            </>
          }
        />
        <Card
          image="https://placehold.co/400x250"
          description={
            <>
              <p> From: Susanne Musterfrau</p>
              <p>📍San Francisco, USA</p>
            </>
          }
        />
      </div>
      <h2 className="text-m">Postcard Map</h2>
      <MapContainer center={position} zoom={13}></MapContainer>
      <div className="cityWrapper">
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
        <CityBadge city="Vienna" country="Austria" />
      </div>
    </main>
  );
}

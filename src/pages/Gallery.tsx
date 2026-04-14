import { Card } from "../components/Card";

export function Gallery() {
  return (
    <main className="left">
      <h2>Your Gallery 🖼️</h2>
      <p>All the postcards you've sent and received</p>
      <div className="button-flex gallery">
        <button className="button button--image">
          <span className="icon-span"></span>
          All Postcards
        </button>
        <button className="button button--image">
          <span className="icon-span"></span>
          Received
        </button>
        <button className="button button--image">
          <span className="icon-span"></span>
          Send
        </button>
      </div>
      <Card
        image="https://placehold.co/400x250"
        description="Nur eine kurze Info ohne Überschrift."
      />
    </main>
  );
}

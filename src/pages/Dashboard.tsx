import { StatisticCard } from "../components/StatisticCard";
import { LinkHeader } from "../components/LinkHeader";
import { MessagePreview } from "../components/MessagePreviewCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function Dashboard() {
  useEffect(() => {
    document.title = "Mia | Dashboard";
  }, []);

  return (
    <main className="left">
      <h1 className="text-l">Hello Sonja ✨</h1>
      <p>Welcome back to Mia. </p>
      <Link className="newPostcard" to="/quest">
        <img src="./icons/add_circle.svg" alt="Plus icon" />
        <h2 className="text-m">New Postcard</h2>
        <p>Write a postcard and make someone smile</p>
      </Link>

      <div className="flexbox-statisticCard">
        <StatisticCard title="Sent" value="34" icon="./icons/letter.svg" />
        <StatisticCard title="Recieved" value="23" icon="./icons/check.svg" />
        <StatisticCard title="Countries" value="10" icon="./icons/flag.svg" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <LinkHeader
            title="Received"
            icon="./icons/letter.svg"
            linkTo="/gallery"
          />
          <MessagePreview
            titel="Von: Max Mustermann"
            country="Austria"
            previewText="These would be the first few lines of your message..."
            to="/gallery"
          />
          <MessagePreview
            titel="Von: Max Mustermann"
            country="Austria"
            previewText="These would be the first few lines of your message..."
            to="/gallery"
          />
          <MessagePreview
            titel="Von: Max Mustermann"
            country="Austria"
            previewText="These would be the first few lines of your message..."
            to="/gallery"
          />
        </div>

        <div className="dashboard-column">
          <LinkHeader
            title="Sent"
            icon="./icons/letter.svg"
            linkTo="/gallery"
          />
          <MessagePreview
            titel="An: Erika Muster"
            country="Germany"
            previewText="These would be the first few lines of your message..."
            statusIcon="./icons/email-white.svg"
            to="/gallery"
          />
          <MessagePreview
            titel="An: Erika Muster"
            country="Germany"
            previewText="These would be the first few lines of your message..."
            statusIcon="./icons/email-white.svg"
            to="/gallery"
          />
        </div>
      </div>
    </main>
  );
}

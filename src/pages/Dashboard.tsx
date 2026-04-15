import { StatisticCard } from "../components/StatisticCard";
import { LinkHeader } from "../components/LinkHeader";
import { MessagePreview } from "../components/MessagePreviewCard";

export function Dashboard() {
  return (
    <main className="left">
      <h2>Hello Sonja ✨</h2>
      <p>Welcome back to Mia. </p>
      <a className="newPostcard" href="/quest">
        <img src="./icons/add_circle.svg" alt="Plus icon" />
        <h4>New Postcard</h4>
        <p>Write a postcard and make someone smile</p>
      </a>

      <div className="flexbox-statisticCard">
        <StatisticCard title="Sent" value="349" icon="./icons/letter.svg" />
        <StatisticCard title="Recieved" value="349" icon="./icons/check.svg" />
        <StatisticCard title="Countries" value="349" icon="./icons/flag.svg" />
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
          />
          <MessagePreview
            titel="Von: Max Mustermann"
            country="Austria"
            previewText="These would be the first few lines of your message..."
          />
           <MessagePreview
            titel="Von: Max Mustermann"
            country="Austria"
            previewText="These would be the first few lines of your message..."
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
          />
          <MessagePreview
            titel="An: Erika Muster"
            country="Germany"
            previewText="These would be the first few lines of your message..."
            statusIcon="./icons/email-white.svg"
          />
        </div>
      </div>
    </main>
  );
}
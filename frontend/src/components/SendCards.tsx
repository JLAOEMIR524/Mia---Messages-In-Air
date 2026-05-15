import React from "react";
import { Link } from "react-router-dom";

interface FeedbackCardProps {
  title?: string;
  message: string | React.ReactNode;
  rating?: number;
  xpAmount: number;
  onContinue: () => void;
  onSeeDetails?: () => void;
  topIconSrc?: string;
}

export function FeedbackCard({
  title = "Postcard Sent! 🎉",
  message,
  rating,
  xpAmount,
  onContinue,
  onSeeDetails,
  topIconSrc = "./icons/star_shine_w.svg",
}: FeedbackCardProps) {
  const totalStars = 5;
  const starArray =
    rating !== undefined
      ? Array.from({ length: totalStars }, (_, index) => index < rating)
      : [];

  return (
    <div className="feedbackContainer">
      <div className="topComponent">
        <div className="topIcon">
          <img src={topIconSrc} alt="Top icon" />{" "}
        </div>
        <h1 className="text-m">{title}</h1>
        <section className="message-content" aria-label="Feedback message">
          {message}
        </section>
      </div>
      {starArray.length > 0 ? (
        <div
          className="xpDisplay"
          aria-label={`You scored ${rating} of 5 Stars.`}
        >
          {starArray.length > 0 &&
            starArray.map((isFilled, index) => (
              <img
                key={index}
                src={
                  isFilled
                    ? "./icons/star_full.svg"
                    : "./icons/star_unfilled.svg"
                }
                alt=""
                aria-hidden="true"
                className={isFilled ? "star--full" : "star--empty"}
              />
            ))}
        </div>
      ) : (
        ""
      )}
      <div className="xpDetails">
        <div className="xpCount">
          <p>+{xpAmount} XP</p>
        </div>
        {onSeeDetails && (
          <Link
            to="/details"
            state={{ fromSend: true }}
            className="xpExpand"
            onClick={onSeeDetails}
          >
            View Details
          </Link>
        )}
      </div>
      <Link
        to="/dashboard"
        className="button button--primary"
        onClick={onContinue}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

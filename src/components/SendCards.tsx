import React from "react";

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
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {starArray.length > 0 ? (<div
        className="xpDisplay"
        aria-label={`You scored ${rating} of 5 Stars.`}
      >
        {starArray.length > 0 && starArray.map((isFilled, index) => (
          <img
            key={index}
            src={
              isFilled ? "./icons/star_full.svg" : "./icons/star_unfilled.svg"
            }
            alt={isFilled ? "filled star icon" : "unfilled star icon"}
            aria-hidden="true"
            className={isFilled ? "star--full" : "star--empty"}
          />
        ))}
      </div>) : ""
          }
      <div className="xpDetails">
        <div className="xpCount">
          <p>+{xpAmount} XP</p>
        </div>
        {onSeeDetails && (
          <button className="xpExpand" onClick={onSeeDetails}>
            See details
          </button>
        )}
      </div>
      <button className="button button--primary" onClick={onContinue}>
        Back to Dashboard
      </button>
    </div>
  );
}

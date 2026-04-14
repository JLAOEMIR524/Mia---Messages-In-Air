import React from 'react';

interface FeedbackCardProps {
  title?: string;
  message: string | React.ReactNode;
  rating: number;
  xpAmount: number;
  onContinue: () => void;
  onSeeDetails?: () => void;
}

export function FeedbackCard({ 
  title = "Postcard Sent", 
  message, 
  rating, 
  xpAmount, 
  onContinue, 
  onSeeDetails 
}: FeedbackCardProps) {
  
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="feedbackContainer">
      <div className="topComponent">
        <div className="topIcon">
          <img src="./icons/star_shine.svg" alt="Star icon" />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>

      <div className="xpDisplay" aria-label={`You scored ${rating} of 5 Stars.`}>
        {stars.map((isFilled, index) => (
          <img
            key={index}
            src="./icons/star_full.svg"
            alt={isFilled ? "filled star icon" : "unfilled star icon"}
            aria-hidden="true"
            className={isFilled ? "" : "star--empty"} 
          />
        ))}
      </div>

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
        Continue
      </button>
    </div>
  );
}
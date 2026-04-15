import { FeedbackCard } from "../components/SendCards";

export function Send() {
  document.body.classList.add("background-heaven");

  return (
    <main className="heaven">
      <FeedbackCard
        title="Postcard Sent! 🎉"
        message={
          <>
            Quest Rating
          </>
        }
        rating={2}
        xpAmount={30}
        onContinue={() => window.location.href = "/dashboard"}
        onSeeDetails={() => window.location.href = "/details"}

      />
    </main>
  );
}

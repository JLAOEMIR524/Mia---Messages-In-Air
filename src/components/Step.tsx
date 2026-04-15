interface StepProps {
  currentStep: number;
  totalSteps?: number;
}

export function Step({ currentStep, totalSteps = 3}: StepProps) {
  return (
    <div className="stepDisplayBox">
      <div className="stepDisplay">
        <img src="./icons/star_shine.svg" alt="Star icon" aria-hidden="true" />
        <p>Step {currentStep} of {totalSteps}</p>
      </div>
    </div>
  );
}
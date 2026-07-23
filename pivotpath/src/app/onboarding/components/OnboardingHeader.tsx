import Link from "next/link";

const STEP_LABELS = ["Profile", "Career Goal", "Background", "Review"];

export function OnboardingHeader({ step }: { step: 1 | 2 | 3 | 4 }) {
  const percent = Math.round((step / 4) * 100);

  return (
    <>
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <div className="hidden md:flex items-center gap-space-md">
          <span className="text-label-md text-on-surface-variant">
            Step {step} of 4: {STEP_LABELS[step - 1]}
          </span>
          <Link
            href="/"
            className="text-label-md text-on-surface-variant hover:text-secondary transition-colors"
          >
            Exit Questionnaire
          </Link>
        </div>
      </header>
      <div className="w-full bg-surface-container-low px-gutter py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-label-sm text-primary uppercase tracking-wider">
              Your Progress
            </span>
            <span className="text-label-sm text-secondary">{percent}% Complete</span>
          </div>
          <div className="w-full h-2 bg-outline-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-tertiary-fixed-dim transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

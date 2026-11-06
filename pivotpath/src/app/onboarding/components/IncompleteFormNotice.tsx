export function IncompleteFormNotice({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-space-sm rounded-lg bg-error-container text-on-error-container p-4 text-label-md"
    >
      <span className="material-symbols-outlined text-[20px]">error</span>
      <span>Please fill in every required field before continuing. The ones to fix are marked above.</span>
    </div>
  );
}

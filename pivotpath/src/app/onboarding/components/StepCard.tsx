export function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-140px)] flex items-start justify-center pt-space-xl pb-space-xl px-gutter bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="mb-space-lg">
            <h1 className="text-headline-lg text-primary mb-2">{title}</h1>
            <p className="text-body-md text-on-surface-variant">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}

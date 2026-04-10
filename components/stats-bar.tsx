export function StatsBar() {
  return (
    <section className="relative z-0 border-y border-border bg-surface-alt/50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:py-10">
        <Stat value="1,000+" label="Active Classes" />
        <Stat value="500+" label="Qualified Tutors" />
        <Stat value="25" label="Districts Covered" />
        <Stat value="40+" label="Subjects Available" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
        {label}
      </p>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { FEATURED_SUBJECTS } from "@/lib/constants";

const GRADE_CATEGORIES = [
  { label: "O/L Classes", value: "O/L (Local)" },
  { label: "A/L Classes", value: "A/L (Local)" },
  { label: "Grade 6-11", value: "Grade 6-9" },
  { label: "Grade 1-5", value: "Grade 1-5" },
];

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
        Browse by Subject
      </h2>
      <p className="mt-2 text-center text-muted">
        Find the right class for your needs
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {FEATURED_SUBJECTS.map((subj) => (
          <Link
            key={subj}
            href={`/search?subject=${encodeURIComponent(subj)}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SubjectIcon subject={subj} />
            </span>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {subj}
            </span>
          </Link>
        ))}
      </div>

      <h3 className="mt-12 text-center text-lg font-bold text-foreground">
        Browse by Grade
      </h3>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {GRADE_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/search?grade=${encodeURIComponent(cat.value)}`}
            className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
          >
            {cat.label}
          </Link>
        ))}
        <Link
          href="/search"
          className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}

function SubjectIcon({ subject }: { subject: string }) {
  switch (subject) {
    case "Mathematics":
      return <MathIcon />;
    case "Physics":
      return <AtomIcon />;
    case "Chemistry":
      return <FlaskIcon />;
    case "Biology":
      return <LeafIcon />;
    case "ICT":
      return <MonitorIcon />;
    case "English":
      return <BookIcon />;
    case "Sinhala":
      return <PenIcon />;
    case "Science":
      return <MicroscopeIcon />;
    default:
      return <BookIcon />;
  }
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function MathIcon() {
  return (
    <IconWrap>
      <path d="M4 6l16 12" />
      <path d="M20 6L4 18" />
    </IconWrap>
  );
}

function AtomIcon() {
  return (
    <IconWrap>
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.5" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.5" transform="rotate(120 12 12)" />
    </IconWrap>
  );
}

function FlaskIcon() {
  return (
    <IconWrap>
      <path d="M10 3h4" />
      <path d="M10 3v5l-5.5 8.5A3 3 0 0 0 7 21h10a3 3 0 0 0 2.5-4.5L14 8V3" />
      <path d="M8.2 14h7.6" />
    </IconWrap>
  );
}

function LeafIcon() {
  return (
    <IconWrap>
      <path d="M20 4c-8 1-13 6-14 14 8-1 13-6 14-14z" />
      <path d="M6 18c2-2 5-4 8-6" />
    </IconWrap>
  );
}

function MonitorIcon() {
  return (
    <IconWrap>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </IconWrap>
  );
}

function BookIcon() {
  return (
    <IconWrap>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5V6.5z" />
      <path d="M7 8h9" />
      <path d="M7 12h9" />
    </IconWrap>
  );
}

function PenIcon() {
  return (
    <IconWrap>
      <path d="M4 20l4.5-1 9.5-9.5-3.5-3.5L5 15.5 4 20z" />
      <path d="M13 6l3.5 3.5" />
    </IconWrap>
  );
}

function MicroscopeIcon() {
  return (
    <IconWrap>
      <path d="M7 21h10" />
      <path d="M10 6l4 4" />
      <path d="M13.5 4.5l2 2" />
      <path d="M9 10a5 5 0 1 0 7 7" />
      <path d="M12 14h4" />
    </IconWrap>
  );
}

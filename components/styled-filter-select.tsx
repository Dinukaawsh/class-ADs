"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

export type FilterSelectOption = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  compact?: boolean;
  variant?: "surface" | "hero";
  id?: string;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function StyledFilterSelect({
  value,
  onChange,
  options,
  compact,
  variant = "surface",
  id: idProp,
}: Props) {
  const reactId = useId();
  const buttonId = idProp ?? `filter-select-${reactId}`;
  const listId = `${buttonId}-list`;

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const foundIdx = options.findIndex((o) => o.value === value);
  const selectedIndex = foundIdx >= 0 ? foundIdx : 0;
  const displayLabel = options[selectedIndex]?.label ?? "";

  const openMenu = useCallback(() => {
    setHighlight(selectedIndex);
    setOpen(true);
  }, [selectedIndex]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = itemRefs.current[highlight];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlight, open]);

  const pick = useCallback(
    (index: number) => {
      const opt = options[index];
      if (opt) {
        onChange(opt.value);
        closeMenu();
      }
    },
    [options, onChange, closeMenu]
  );

  const onButtonKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Escape") {
        if (open) {
          e.preventDefault();
          closeMenu();
        }
        return;
      }

      if (!open) {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "Enter" ||
          e.key === " "
        ) {
          e.preventDefault();
          openMenu();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(options.length - 1, h + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setHighlight(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setHighlight(options.length - 1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(highlight);
      }
    },
    [open, options.length, highlight, pick, openMenu, closeMenu]
  );

  const baseBtn =
    "flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 text-left font-medium transition focus:shadow-none focus:outline-none focus:ring-2 focus:ring-primary/25";
  const sizingBtn = compact
    ? "min-h-9 rounded-xl px-3 py-2 text-xs leading-tight"
    : "min-h-11 rounded-2xl px-4 py-2.5 text-sm";
  const surfaceBtn =
    variant === "hero"
      ? "border-2 border-white/55 bg-white/95 text-gray-900 shadow-md backdrop-blur-sm hover:border-white hover:bg-white hover:shadow-lg focus:border-accent focus:ring-accent/25"
      : "border-2 border-border/90 bg-linear-to-b from-white to-gray-50/95 text-foreground shadow-sm hover:border-primary/45 hover:shadow-md focus:border-primary";

  const listPanel =
    variant === "hero"
      ? "mt-1.5 max-h-[min(18rem,calc(100vh-10rem))] overflow-y-auto rounded-2xl border-2 border-white/70 bg-white py-2 shadow-2xl shadow-black/15 ring-1 ring-black/5 backdrop-blur-md"
      : "mt-1.5 max-h-[min(18rem,calc(100vh-10rem))] overflow-y-auto rounded-2xl border-2 border-border/90 bg-white py-2 shadow-2xl shadow-primary/10 ring-1 ring-black/[0.04]";

  const onRootBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      if (!open) return;
      const next = e.relatedTarget as Node | null;
      if (next && rootRef.current?.contains(next)) return;
      closeMenu();
    },
    [open, closeMenu]
  );

  return (
    <div
      ref={rootRef}
      className="relative min-w-0"
      onBlur={onRootBlur}
    >
      <button
        type="button"
        id={buttonId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`${baseBtn} ${sizingBtn} ${surfaceBtn}`}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          className={`absolute top-full z-100 w-full ${listPanel}`}
        >
          {options.map((opt, i) => {
            const isSelected = value === opt.value;
            const isActive = highlight === i;
            const itemSize = compact
              ? "px-3 py-2 text-xs leading-snug"
              : "px-3 py-2.5 text-sm";
            return (
              <li
                key={opt.value === "" ? "__all__" : opt.value}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="option"
                aria-selected={isSelected}
                className={`mx-1.5 cursor-pointer rounded-xl transition-colors first:mt-0 last:mb-0 ${itemSize} ${
                  isSelected
                    ? "bg-primary font-semibold text-white shadow-sm"
                    : isActive
                      ? "bg-primary/12 font-medium text-foreground"
                      : "text-foreground hover:bg-gray-50"
                }`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(i)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

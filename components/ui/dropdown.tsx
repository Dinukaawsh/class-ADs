"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DropdownOption = {
  label: string;
  value: string;
};

export function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  name,
  required = false,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((item) => item.value === value),
    [options, value]
  );

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={selected ? "text-foreground" : "text-muted"}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-white p-1 shadow-lg custom-scrollbar">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface-alt"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                option.value === value
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-surface-alt"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {name ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={() => undefined}
          required={required}
          readOnly
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

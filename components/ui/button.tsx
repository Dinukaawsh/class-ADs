import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const base =
    "rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : "border border-border text-muted hover:bg-surface-alt hover:text-foreground";

  return <button className={`${base} ${styles} ${className}`.trim()} {...props} />;
}

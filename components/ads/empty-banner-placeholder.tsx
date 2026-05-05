type EmptyBannerPlaceholderProps = {
  /** Narrow column square slots vs wide hero strip */
  variant: "normal" | "premium";
};

export function EmptyBannerPlaceholder({ variant }: EmptyBannerPlaceholderProps) {
  const isPremium = variant === "premium";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className={
          isPremium
            ? "relative z-0 flex min-h-[30%] shrink-0 items-center justify-center bg-[#60a5fa] px-2 py-2 sm:px-3"
            : "relative z-0 flex min-h-[30%] shrink-0 items-center justify-center overflow-hidden bg-primary-dark/88 px-2 py-2 shadow-[inset_0_-1px_0_0_rgb(255_255_255/0.08)] backdrop-blur-md sm:px-3"
        }
      >
        <p
          lang="si"
          className={
            isPremium
              ? "relative z-10 font-premium-banner-si text-balance text-center text-[13px] font-semibold leading-snug text-white sm:text-[15px] md:text-lg"
              : "relative z-10 font-premium-banner-si text-balance text-center text-[10px] font-semibold leading-snug text-white drop-shadow-sm sm:text-[12px] md:text-sm"
          }
        >
          ඔබේ දැන්වීම මෙහි පළ කරන්න
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1 bg-background px-2 py-2 sm:gap-1.5">
        <p
          lang="si"
          className={
            isPremium
              ? "font-premium-banner-si text-[11px] font-semibold text-muted-foreground sm:text-xs"
              : "font-premium-banner-si text-[9px] font-semibold text-muted-foreground sm:text-[11px]"
          }
        >
          අමතන්න
        </p>
        <p
          className={
            isPremium
              ? "text-center text-xl font-black tabular-nums tracking-tight text-foreground sm:text-2xl md:text-3xl"
              : "text-center text-base font-black tabular-nums tracking-tight text-foreground sm:text-lg md:text-xl"
          }
        >
          076&nbsp;732&nbsp;6845
        </p>
      </div>
    </div>
  );
}

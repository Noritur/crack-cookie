export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 px-6 py-6 md:px-12">
      <div className="flex flex-col items-center justify-between gap-2 text-[13px] text-muted-foreground md:flex-row">
        <span style={{ fontFamily: "var(--font-geist-sans)" }}>
          © {year} FortuneCrack
        </span>
        <span style={{ fontFamily: "var(--font-funnel-sans)" }}>
          розламуй тихо, читай уважно
        </span>
      </div>
    </footer>
  );
}

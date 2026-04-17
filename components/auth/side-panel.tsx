export function SidePanel({ quote }: { quote: string }) {
  return (
    <div
      className="relative hidden h-full flex-col justify-end p-12 lg:flex"
      style={{
        background:
          "linear-gradient(135deg, #ff7a2b 0%, #ff5c00 60%, #c94400 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay [background:radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.35),transparent_55%)]" />
      <div
        className="relative rounded-lg bg-black/35 px-6 py-5 backdrop-blur-sm"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <p className="text-[18px] italic leading-relaxed text-white">{quote}</p>
      </div>
    </div>
  );
}

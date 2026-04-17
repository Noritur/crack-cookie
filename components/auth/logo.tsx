import { Cookie } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Cookie className="size-7 text-primary" strokeWidth={2} />
      <span
        className="text-[22px] font-bold text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        FortuneCrack
      </span>
    </div>
  );
}

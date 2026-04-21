import Image from "next/image";

type Props = {
  quote: string;
  variant?: "login" | "signup";
};

export function SidePanel({ quote, variant = "login" }: Props) {
  const src = variant === "signup" ? "/auth/signup-bg.png" : "/auth/login-bg.png";

  return (
    <div className="relative hidden h-full flex-col justify-end overflow-hidden p-12 lg:flex">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 0px"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div
        className="relative rounded-lg bg-black/35 px-6 py-5 backdrop-blur-sm"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <p className="text-[18px] italic leading-relaxed text-white">{quote}</p>
      </div>
    </div>
  );
}

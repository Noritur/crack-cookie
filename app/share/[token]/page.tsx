import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { decodeShareToken } from "@/lib/share";

type Params = { token: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { token } = await params;
  const text = decodeShareToken(token);
  if (!text) return { title: "Фортуна — FortuneCrack" };

  const description = `«${text}»`;
  return {
    title: "Моя фортуна — FortuneCrack",
    description,
    openGraph: {
      title: "Моя фортуна — FortuneCrack",
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Моя фортуна — FortuneCrack",
      description,
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;
  const text = decodeShareToken(token);
  if (!text) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-16 text-center">
      <span
        className="text-[14px] font-semibold uppercase tracking-[0.18em] text-primary"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        FortuneCrack
      </span>
      <p
        className="max-w-2xl text-[24px] leading-relaxed text-foreground md:text-[32px]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        «{text}»
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:opacity-90"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        Розламай своє пророцтво →
      </Link>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { decodeShareToken } from "@/lib/share";
import { createClient } from "@/lib/supabase/server";

type Params = { token: string };

const SAMPLE_COUNT = 3;

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

function offsetFromToken(token: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) - h + token.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

async function fetchSampleFortunes(token: string, exclude: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("fortunes")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (!count || count <= SAMPLE_COUNT) return [];

  const window = Math.max(count - SAMPLE_COUNT, 1);
  const offset = offsetFromToken(token, window);

  const { data } = await supabase
    .from("fortunes")
    .select("id, text")
    .eq("is_active", true)
    .order("id", { ascending: true })
    .range(offset, offset + SAMPLE_COUNT);

  return (data ?? [])
    .filter((row) => row.text !== exclude)
    .slice(0, SAMPLE_COUNT);
}

export default async function SharePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;
  const text = decodeShareToken(token);
  if (!text) notFound();

  const samples = await fetchSampleFortunes(token, text);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 py-12 md:py-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <span
          className="text-[14px] font-semibold uppercase tracking-[0.18em] text-primary"
          style={{ fontFamily: "var(--font-funnel-sans)" }}
        >
          FortuneCrack
        </span>

        <article className="w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF5C00] via-[#FF8533] to-[#FFB380] p-1">
          <div className="flex flex-col gap-4 rounded-[14px] bg-card px-6 py-10 md:px-10 md:py-14">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary"
              style={{ fontFamily: "var(--font-funnel-sans)" }}
            >
              Передбачення
            </span>
            <p
              className="text-[22px] leading-relaxed text-foreground md:text-[28px]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              «{text}»
            </p>
          </div>
        </article>

        <div className="flex w-full flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:opacity-90"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Розламай своє пророцтво →
          </Link>
          <a
            href={`/share/${token}/story`}
            download="fortunecrack-story.png"
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full border border-border bg-card px-6 text-[15px] font-semibold text-foreground hover:bg-muted"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Завантажити для Instagram Story
          </a>
        </div>

        {samples.length > 0 && (
          <section className="w-full">
            <h2
              className="mb-4 text-[14px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              style={{ fontFamily: "var(--font-funnel-sans)" }}
            >
              Що ще пророкує печиво
            </h2>
            <ul className="grid grid-cols-1 gap-3">
              {samples.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl bg-card px-5 py-4 text-left ring-1 ring-border"
                >
                  <p
                    className="text-[15px] leading-relaxed text-foreground"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    «{s.text}»
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

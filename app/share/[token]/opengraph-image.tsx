import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { decodeShareToken } from "@/lib/share";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Фортуна — FortuneCrack";

export default async function Image({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const text = decodeShareToken(token) ?? "Твоя фортуна чекає";
  const interBold = await readFile(
    join(process.cwd(), "public/fonts/Inter-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #FF5C00 0%, #FF8533 60%, #FFB380 100%)",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          FortuneCrack
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            lineHeight: 1.2,
            color: "white",
            fontWeight: 700,
            maxWidth: 1040,
          }}
        >
          «{text}»
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          crack-cookie.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}

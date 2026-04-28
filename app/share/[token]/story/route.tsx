import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { decodeShareToken } from "@/lib/share";

const SIZE = { width: 1080, height: 1920 };

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
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
          padding: 96,
          background:
            "linear-gradient(180deg, #FF5C00 0%, #FF8533 50%, #FFB380 100%)",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 36,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          FortuneCrack
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.25,
              color: "white",
              fontWeight: 700,
              maxWidth: 880,
              textAlign: "center",
            }}
          >
            «{text}»
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "white",
              fontWeight: 700,
            }}
          >
            crack-cookie.vercel.app
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Розламай своє пророцтво ↓
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
      headers: {
        "Content-Disposition":
          'inline; filename="fortunecrack-story.png"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}

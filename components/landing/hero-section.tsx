import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmailCapture } from "@/components/landing/email-capture";
import { PublicFortune } from "@/components/landing/public-fortune";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/landing/hero-bg.png"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 60vw, 100vw"
          className="hidden object-cover object-right-top opacity-80 md:block"
        />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <Image
          src="/landing/hero-bg-mobile.png"
          alt=""
          width={390}
          height={360}
          priority
          sizes="100vw"
          className="block h-[320px] w-full object-cover md:hidden"
        />
        <div className="block md:hidden absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="relative flex min-h-[720px] flex-col gap-10 px-6 pb-12 pt-[280px] md:px-12 md:pb-20 md:pt-24 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:pt-28">
        <div className="flex flex-col gap-6 lg:max-w-[560px]">
          <h1
            className="text-[36px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[56px] lg:text-[72px]"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "-1.5px" }}
          >
            Розламай своє<br />пророцтво
          </h1>
          <p
            className="max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-[18px]"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Розкривай віртуальні печива з передбаченнями та відкривай давню мудрість, грайливі прогнози й неочікувані інсайти. Твоє наступне передбачення за один дотик.
          </p>
          <div className="flex flex-col gap-3">
            <EmailCapture />
            <Link
              href="/login?next=/account"
              className={`${buttonVariants({ variant: "outline" })} h-11 self-start rounded-full px-6 text-[14px] font-medium`}
            >
              Переглянути колекцію
            </Link>
          </div>
        </div>

        <div className="lg:pl-4">
          <PublicFortune />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/seo/constants";
import logoNavy from "../../public/brand/logo-navy.webp";
import logoIvory from "../../public/brand/logo-ivory.webp";

interface LogoProps {
  variant?: "full" | "stacked" | "icon";
  theme?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "full", theme = "light", className = "" }: LogoProps) {
  const logo = theme === "dark" ? logoIvory : logoNavy;

  if (variant === "icon") {
    return (
      <Link href="/" className={`block ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
        <Image
          src={logo}
          alt={SITE_CONFIG.name}
          quality={85}
          sizes="(min-width: 640px) 430px, 340px"
          className="h-16 w-auto object-contain sm:h-20"
        />
      </Link>
    );
  }

  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-flex flex-col items-start gap-3 ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
        <Image
          src={logo}
          alt={SITE_CONFIG.name}
          quality={85}
          sizes="(min-width: 640px) 304px, 264px"
          className="h-auto w-[264px] max-w-full object-contain sm:w-[304px]"
        />
        <span className={`text-xs uppercase tracking-[0.18em] ${theme === "dark" ? "text-white/65" : "text-slate"}`}>
          {SITE_CONFIG.tagline}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex min-w-0 items-center ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
      <Image
        src={logo}
        alt={SITE_CONFIG.name}
        quality={85}
        preload
        sizes="(min-width: 1024px) 232px, (min-width: 640px) 220px, 190px"
        className="h-auto w-[190px] min-w-0 object-contain sm:w-[220px] lg:w-[232px]"
      />
    </Link>
  );
}

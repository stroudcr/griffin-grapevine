import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/seo/constants";

interface LogoProps {
  variant?: "full" | "stacked" | "icon";
  className?: string;
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "icon") {
    return (
      <Link href="/" className={`block ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
        <Image
          src={SITE_CONFIG.logoPath}
          alt={SITE_CONFIG.name}
          width={SITE_CONFIG.logoWidth}
          height={SITE_CONFIG.logoHeight}
          quality={75}
          className="h-16 w-auto object-contain sm:h-20"
        />
      </Link>
    );
  }

  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-flex flex-col items-start gap-3 ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
        <Image
          src={SITE_CONFIG.logoPath}
          alt={SITE_CONFIG.name}
          width={SITE_CONFIG.logoWidth}
          height={SITE_CONFIG.logoHeight}
          quality={75}
          className="h-14 w-auto object-contain sm:h-16"
        />
        <span className="text-sm uppercase tracking-[0.24em] text-slate">
          {SITE_CONFIG.tagline}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex min-w-0 items-center ${className}`} aria-label={`${SITE_CONFIG.name} home`}>
      <Image
        src={SITE_CONFIG.logoPath}
        alt={SITE_CONFIG.name}
        width={SITE_CONFIG.logoWidth}
        height={SITE_CONFIG.logoHeight}
        quality={75}
        className="h-8 w-auto min-w-0 object-contain sm:h-10"
      />
    </Link>
  );
}

import type { ReactNode } from "react";
import { Footer, Header } from "@/components";

/** Every Local Business Guide page shares the site header, footer and warm paper background. */
export default function DirectoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

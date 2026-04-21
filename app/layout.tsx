import type { Metadata } from "next";
import { Poppins, Geist_Mono, Geist } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import MagicRings from "@/components/MagicRings";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClassAds — Find Tuition Classes in Sri Lanka",
    template: "%s · ClassAds",
  },
  description:
    "Sri Lanka's modern tuition class marketplace. Search and find the best tuition classes by subject, grade, or location. Post your class for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, geistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <main className="relative flex-1 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-35">
            <MagicRings />
          </div>
          <div className="relative z-10">{children}</div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

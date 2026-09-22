import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Felgenhotel – Felgenreparatur & Veredelung in Köln",
  description:
    "Felgenhotel in Köln: Felgenreparatur, Smart Repair, Felgen richten, Lackierung, Pulverbeschichtung und Veredelung. Präzises Handwerk für beschädigte und individuelle Felgen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

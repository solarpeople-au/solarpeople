import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Solar People | Melbourne Solar & Battery Specialists",
    template: "%s | The Solar People",
  },
  description:
    "Professional residential and commercial solar panel and battery installations across Melbourne.",
  icons: { icon: "/solar-people-logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={publicSans.variable}>{children}</body>
    </html>
  );
}

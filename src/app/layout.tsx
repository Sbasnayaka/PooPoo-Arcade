import type { Metadata } from "next";
import { Fredoka, Courier_Prime } from "next/font/google";
import "./globals.css";

const mupen = Fredoka({
  variable: "--font-mupen",
  subsets: ["latin"],
});

const vcr = Courier_Prime({
  variable: "--font-vcr",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PooPoo Arcade",
  description: "A Neo-Brutalist Fecal Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mupen.variable} ${vcr.variable} antialiased`}
        style={{
            // @ts-ignore
            "--font-comic": '"Comic Sans MS", "Comic Sans", cursive'
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}

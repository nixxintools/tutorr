import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: {
    default: "TutorAI",
    template: "%s | TutorAI",
  },
  description: "AI-powered tutoring for students, tools for teachers, visibility for parents",
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable} antialiased`} style={{ backgroundColor: "var(--bg-base)", color: "var(--text)" }}>
        <div className="page-enter">{children}</div>
      </body>
    </html>
  );
}

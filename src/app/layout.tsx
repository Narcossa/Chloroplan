import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthWrapper } from "@/components/AuthWrapper";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chloroplan - Gestion",
  description: "Logiciel de gestion de chantiers et poseurs",
};

export const instant = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${workSans.variable} font-sans antialiased flex h-screen w-full bg-[var(--color-background)] overflow-hidden`}
      >
        <AuthWrapper>
          <Sidebar />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}

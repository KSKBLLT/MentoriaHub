import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Mentoria Hub",
  description: "From eligibility to acceptance — find what you qualify for, get ready, prove it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}

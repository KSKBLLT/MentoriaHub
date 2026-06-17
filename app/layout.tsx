import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Mentoria Hub",
  description: "From eligibility to acceptance: find what you qualify for, get ready, prove it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="ambient-scene" aria-hidden="true" />
        <div className="app-shell">
          <Nav />
          <div className="app-workspace">{children}</div>
        </div>
      </body>
    </html>
  );
}

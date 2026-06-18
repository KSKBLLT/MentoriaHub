import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Aurora from "./components/Aurora";
import Grainient from "./components/Grainient";

export const metadata: Metadata = {
  title: "Mentoria Hub",
  description: "From eligibility to acceptance: find what you qualify for, get ready, prove it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="grainient-bg" aria-hidden="true">
          <Grainient
            color1="#253362"
            color2="#5227FF"
            color3="#3B82F6"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>
        <div className="ambient-scene" aria-hidden="true">
          <Aurora
            colorStops={["#4b7cff", "#76ddff", "#5227FF"]}
            blend={0.6}
            amplitude={1.1}
            speed={0.5}
          />
        </div>
        <div className="app-shell">
          <Nav />
          <div className="app-workspace">{children}</div>
        </div>
      </body>
    </html>
  );
}

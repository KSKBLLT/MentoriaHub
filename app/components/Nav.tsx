"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Books,
  Briefcase,
  Certificate,
  Compass,
  Gauge,
  GearSix,
  House,
  MapTrifold,
  ShieldCheck,
} from "@phosphor-icons/react";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/opportunities", label: "Discover", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: MapTrifold },
  { href: "/courses", label: "Courses", icon: Books },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/portfolio", label: "Portfolio", icon: Certificate },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="top">
      <div className="inner">
        <Link href="/" className="brand" aria-label="Mentoria Hub home">
          <span className="brand-mark">M</span>
          <span>Mentoria Hub</span>
        </Link>
        <div className="nav-links">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={active ? "active" : undefined}>
                <span className="nav-icon"><Icon size={18} weight={active ? "fill" : "bold"} /></span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="nav-footer">
          <span className="nav-icon"><GearSix size={18} weight="bold" /></span>
          <span>Ready to code</span>
        </div>
      </div>
    </nav>
  );
}

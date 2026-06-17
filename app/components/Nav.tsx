import Link from "next/link";

export default function Nav() {
  return (
    <nav className="top">
      <div className="inner">
        <Link href="/" className="brand">Mentoria Hub</Link>
        <Link href="/opportunities">Возможности</Link>
        <Link href="/roadmap">Роадмап</Link>
        <Link href="/courses">Курсы</Link>
        <Link href="/applications">Заявки</Link>
        <Link href="/dashboard">Кабинет</Link>
        <Link href="/portfolio">Портфолио</Link>
        <Link href="/admin">Админка</Link>
      </div>
    </nav>
  );
}

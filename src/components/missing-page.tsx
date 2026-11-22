import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ArrowLeft, Compass } from "lucide-react";
import { homePath, translate, type Locale } from "../lib/locale";
export function MissingPage({ locale }: { locale: Locale }) {
  return <main className="not-found"><ThemeToggle locale={locale} /><Compass size={56} /><span className="eyebrow">{translate(locale, "notFoundEyebrow")}</span><h1>{translate(locale, "notFoundTitle")}</h1><p>{translate(locale, "notFoundDescription")}</p><Link className="button primary" href={homePath(locale)}><ArrowLeft size={18} />{translate(locale, "homeBack")}</Link></main>;
}

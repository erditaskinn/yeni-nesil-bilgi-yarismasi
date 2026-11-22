import { Mail } from "lucide-react";
import type { Locale } from "../lib/locale";

export function ContactLink({ locale }: { locale: Locale }) {
  return <a className="contact-link" href="mailto:info@yeninesilbilgiyarismasi.com"><Mail size={16} aria-hidden="true" />{locale === "en" ? "Contact" : "İletişim"}</a>;
}

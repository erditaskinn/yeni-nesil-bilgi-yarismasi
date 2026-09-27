import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <main className="not-found">
      <Compass size={56} />
      <span className="eyebrow">404 · SAYFA BULUNAMADI</span>
      <h1>Bu sorunun cevabı başka yerde.</h1>
      <p>
        Aradığın sayfa bulunamadı. Yeni bir keşif için ana sayfaya dönebilirsin.
      </p>
      <Link className="button primary" href="/">
        <ArrowLeft size={18} /> Ana Sayfaya Dön
      </Link>
    </main>
  );
}

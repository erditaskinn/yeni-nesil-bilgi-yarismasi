"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="not-found">
      <h1>Kısa bir mola oldu.</h1>
      <p>Yarışma yüklenirken bir sorun oluştu. Yeniden deneyebilirsin.</p>
      <button className="button primary" onClick={reset}>
        Yeniden Dene
      </button>
      <Link href="/">Ana sayfaya dön</Link>
    </main>
  );
}

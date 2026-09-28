"use client";
import Image from "next/image";
import { useState } from "react";
import type { Question } from "../lib/types";

export function QuestionImage({ image, showCredit = false }: { image: NonNullable<Question["image"]>; showCredit?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <figure className="question-figure">
    {failed ? <p role="status">Görsel yüklenemedi. Soruyu metinden cevaplayabilirsin.</p> : <Image className="question-image" src={image.src} alt={image.alt} width={image.width} height={image.height} onError={() => setFailed(true)} />}
    {showCredit && <figcaption className="image-credit"><a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.credit} · Görsel kaynağı<span className="sr-only"> (yeni sekmede açılır)</span></a></figcaption>}
  </figure>;
}

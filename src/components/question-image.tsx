"use client";
import { useI18n } from "./locale-provider";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { Question } from "../lib/types";

export function QuestionImage({ image, showCredit = false, onLoad, onError }: { image: NonNullable<Question["image"]>; showCredit?: boolean; onLoad?: () => void; onError?: () => void }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  return <figure className="question-figure">
    {failed ? <p role="status">{t("imageError")}</p> : <>
      {!loaded && <div className="question-image-skeleton" role="status" aria-label={t("imageLoading")} />}
      <Image className={`question-image ${zoomed ? "is-zoomed" : ""}`} src={image.src} alt={image.alt} width={image.width} height={image.height}
        style={{ visibility: loaded ? "visible" : "hidden", height: loaded ? undefined : 0 }}
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        onError={() => { setFailed(true); onError?.(); }} />
      {loaded && <button className="image-zoom" type="button" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}
        title={zoomed ? t("imageZoomOut") : t("imageZoomIn")} aria-label={zoomed ? t("imageZoomOut") : t("imageZoomIn")}>
        {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
      </button>}
    </>}
    {showCredit && <figcaption className="image-credit"><a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.credit} · {t("imageSource")}<span className="sr-only">{t("newTab")}</span></a></figcaption>}
  </figure>;
}

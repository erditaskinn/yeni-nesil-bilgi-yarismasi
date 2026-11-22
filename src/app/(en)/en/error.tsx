"use client";
import Link from "next/link";
import { translate } from "../../../lib/locale";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="not-found"><h1>{translate("en", "errorTitle")}</h1><p>{translate("en", "errorDescription")}</p><button className="button primary" onClick={reset}>{translate("en", "tryAgain")}</button><Link href="/en">{translate("en", "homeBack")}</Link></main>;
}

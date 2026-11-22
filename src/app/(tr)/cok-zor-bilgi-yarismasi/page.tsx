import type { Metadata } from "next";
import { LevelGuide } from "../../../components/level-guide";
import { levelMetadata, levelPath } from "../../../lib/level-pages";
import { SITE_URL } from "../../../lib/config";
const difficulty = "expert";
export const metadata: Metadata = { ...levelMetadata(difficulty), robots: { index: false, follow: true }, alternates: { canonical: `${SITE_URL}${levelPath("hard")}` } };
export default function Page() { return <LevelGuide difficulty={difficulty} />; }

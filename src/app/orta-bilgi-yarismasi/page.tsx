import { LevelGuide } from "../../components/level-guide";
import { levelMetadata } from "../../lib/level-pages";
const difficulty = "medium";
export const metadata = levelMetadata(difficulty);
export default function Page() { return <LevelGuide difficulty={difficulty} />; }

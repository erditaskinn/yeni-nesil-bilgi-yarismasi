import { SiteLayout } from "../../components/site-layout";
import { homeMetadata } from "../../lib/site-metadata";
export const metadata = homeMetadata("tr");
export const viewport = { themeColor: "#087b66" };
export default function Layout({ children }: { children: React.ReactNode }) { return <SiteLayout locale="tr">{children}</SiteLayout>; }

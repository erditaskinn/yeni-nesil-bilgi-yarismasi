import { AccountDocument } from "../../../../components/account-document";
import { localizedMetadata } from "../../../../lib/site-metadata";
export const metadata = localizedMetadata("en", "Privacy | Next Gen Trivia Quiz", "Optional accounts, local records and how account data are used.", "/gizlilik", "/en/privacy");
export default function Page() { return <AccountDocument locale="en" kind="privacy" />; }

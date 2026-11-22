import { AccountDocument } from "../../../../components/account-document";
import { localizedMetadata } from "../../../../lib/site-metadata";
export const metadata = localizedMetadata("en", "Account Deletion | Next Gen Trivia Quiz", "Delete your account and cloud personal bests, or request deletion if you cannot sign in.", "/hesap-silme", "/en/delete-account");
export default function Page() { return <AccountDocument locale="en" kind="deletion" />; }

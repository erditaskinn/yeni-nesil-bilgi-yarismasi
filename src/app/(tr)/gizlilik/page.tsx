import { AccountDocument } from "../../../components/account-document";
import { localizedMetadata } from "../../../lib/site-metadata";
export const metadata = localizedMetadata("tr", "Gizlilik | Yeni Nesil Bilgi Yarışması", "İsteğe bağlı üyelik, cihazda tutulan kayıtlar ve hesap verilerinin kullanımı.", "/gizlilik", "/en/privacy");
export default function Page() { return <AccountDocument locale="tr" kind="privacy" />; }

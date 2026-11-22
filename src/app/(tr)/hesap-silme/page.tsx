import { AccountDocument } from "../../../components/account-document";
import { localizedMetadata } from "../../../lib/site-metadata";
export const metadata = localizedMetadata("tr", "Hesap Silme | Yeni Nesil Bilgi Yarışması", "Üyelik hesabını ve bulut rekorlarını silme, erişim sorunu durumunda talep gönderme.", "/hesap-silme", "/en/delete-account");
export default function Page() { return <AccountDocument locale="tr" kind="deletion" />; }

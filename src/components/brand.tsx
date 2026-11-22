import Image from "next/image";
import { translate, type Locale } from "../lib/locale";
export function Brand({ locale = "tr" }: { locale?: Locale }) {
  return (
    <span className="brand">
      <Image className="brand-logo" src="/logo-brand.webp" width={900} height={251} alt={translate(locale, "brand")} unoptimized />
    </span>
  );
}

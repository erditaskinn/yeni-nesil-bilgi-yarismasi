import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  qr: "https://www.qrcode.com/en/history/",
  bluetooth: "https://www.bluetooth.com/learn-about-bluetooth/tech-overview/",
  usb: "https://www.usb.org/usb-charger-pd",
  backup: "https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf",
  ransomware: "https://www.cisa.gov/sites/default/files/publications/protecting_your_networks_from_ransomware.pdf",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["traf001", "easy", "technology", "Bir QR kodunu telefonla okumak için genellikle ne kullanılır?", ["Kamera", "Hoparlör", "Mikrofon", "Şarj kablosu"], "DENSO WAVE, kameralı telefonların QR kodları okuyarak bağlantı ve kuponlara erişebildiğini açıklar.", "qr"],
  ["traf002", "medium", "technology", "QR kodu ilk duyuran şirket hangisidir?", ["DENSO WAVE", "NASA", "UNESCO", "IBM"], "DENSO WAVE, QR kodunu 1994'te duyurduğunu belirtir.", "qr"],
  ["traf003", "hard", "technology", "QR kodu ilk kez hangi yıl duyuruldu?", ["1994", "1980", "2008", "2016"], "DENSO WAVE, QR kodunun 1994'te duyurulduğunu kaydeder.", "qr"],
  ["traf004", "medium", "technology", "QR kodun geleneksel çizgi barkoda göre temel farkı nedir?", ["Bilgiyi iki yönde kodlaması", "Yalnız ses kaydetmesi", "Sadece metal yüzeyde çalışması", "Elektrikle şarj edilmesi"], "DENSO WAVE, QR kod gibi iki boyutlu kodların bilgiyi yatay ve dikey yönlerde tuttuğunu açıklar.", "qr"],
  ["traf005", "hard", "technology", "QR kodun köşelerindeki belirgin kare işaretler neye yardım eder?", ["Kodun konumunun saptanmasına", "Telefonun şarj olmasına", "Ekran sesinin açılmasına", "İnternet şifresinin üretilmesine"], "DENSO WAVE, kare konum işaretlerinin hızlı okumayı mümkün kıldığını açıklar.", "qr"],
  ["traf006", "easy", "technology", "Kablosuz kulaklığı telefona bağlamak için sık kullanılan teknoloji hangisidir?", ["Bluetooth", "GPS", "HDMI", "Ethernet"], "Bluetooth SIG, Bluetooth'u kablosuz kulaklık ve hoparlör bağlantılarında kullanılan radyo teknolojisi olarak açıklar.", "bluetooth"],
  ["traf007", "medium", "technology", "Bluetooth Classic özellikle hangi kullanımda yaygındır?", ["Kablosuz ses aktarımı", "Kâğıt basımı", "Uydu fırlatma", "Dosya sıkıştırma"], "Bluetooth SIG, Bluetooth Classic'in başlıca kablosuz ses akışında kullanıldığını belirtir.", "bluetooth"],
  ["traf008", "medium", "technology", "Bluetooth LE'deki 'LE' neyi vurgular?", ["Düşük enerji tüketimini", "Uzun Ethernet kablosunu", "Lazer ekranı", "Yerel elektriği"], "Bluetooth SIG, Bluetooth LE'nin çok düşük güçle çalışacak şekilde tasarlandığını açıklar.", "bluetooth"],
  ["traf009", "hard", "technology", "Bluetooth Classic ve Bluetooth LE hangi frekans bandını kullanır?", ["2,4 GHz", "50 Hz", "88–108 MHz", "30 GHz"], "Bluetooth SIG, iki radyo türünün de 2,4 GHz bandında çalıştığını belirtir.", "bluetooth"],
  ["traf010", "medium", "technology", "Bluetooth LE, iki cihaz arasındaki bağlantı dışında hangi ağ düzenini de destekler?", ["Örgü (mesh) ağ", "Yalnız telefon hattı", "Sadece uydu ağı", "Yalnız kablolu ağ"], "Bluetooth SIG, Bluetooth LE'nin noktadan noktaya bağlantının yanında yayın ve örgü ağ düzenlerini desteklediğini açıklar.", "bluetooth"],
  ["traf011", "easy", "technology", "USB kablosu veri aktarımının yanında ne taşıyabilir?", ["Elektrik gücü", "Basılı kâğıt", "Mürekkep", "Benzin"], "USB-IF, USB'nin veriyle birlikte aygıtlara güç sağlayabildiğini açıklar.", "usb"],
  ["traf012", "medium", "technology", "USB Power Delivery (USB PD) standardı esas olarak neyi düzenler?", ["USB üzerinden güç aktarımını", "Fotoğraf sıkıştırmasını", "Kablosuz radyo yayınını", "Ekran çözünürlüğünü"], "USB-IF, USB PD'nin USB üzerinden esnek güç aktarımı sağladığını açıklar.", "usb"],
  ["traf013", "expert", "technology", "USB PD 3.1 ile tam özellikli USB-C kablo üzerinden desteklenen en yüksek güç kaç watt'tır?", ["240 W", "24 W", "60 W", "100 W"], "USB-IF, USB PD 3.1'in uygun USB-C kablo ve bağlantı ile 240 W'a kadar güç sağlayabildiğini belirtir.", "usb"],
  ["traf014", "easy", "technology", "Önemli dosyaların yedeğini almak en çok hangi durumda işe yarar?", ["Asıl dosyalar kaybolduğunda", "Ekran parlaklığı azaldığında", "Klavye rengi değiştiğinde", "Hoparlör sesi yükseldiğinde"], "CISA, veri kaybına karşı önemli dosyaların yedek kopyalarını saklamayı önerir.", "backup"],
  ["traf015", "medium", "technology", "Bilgisayardaki dosyaların ayrı bir kopyası nerede tutulabilir?", ["Harici diskte", "Yalnız RAM'de", "Sadece ekranda", "Klavye tuşlarında"], "CISA, harici depolama ortamlarını yedekleme seçenekleri arasında sayar.", "backup"],
  ["traf016", "medium", "technology", "Fidye yazılımına karşı bir yedeği çevrimdışı tutmanın amacı nedir?", ["Yedeğin de şifrelenmesi riskini azaltmak", "Monitörü büyütmek", "İnterneti hızlandırmak", "Dosya adlarını kısaltmak"], "CISA, fidye yazılımlarının erişilebilir yedekleri de etkileyebileceği için çevrimdışı yedek önerir.", "ransomware"],
  ["traf017", "hard", "technology", "Yedeklemede '3-2-1' kuralındaki '3' neyi ifade eder?", ["Önemli dosyanın toplam üç kopyasını", "Her dosyanın üç harfli olmasını", "Yedeğin üç dakikada alınmasını", "Üç farklı parola kullanılmasını"], "CISA'nın 3-2-1 kuralında bir asıl dosya ve iki yedek olmak üzere toplam üç kopya bulunur.", "backup"],
];

export const turkishBalanceNineteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

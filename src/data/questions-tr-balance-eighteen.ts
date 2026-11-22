import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  hardware: "https://www.ibm.com/think/topics/hardware",
  os: "https://www.ibm.com/think/topics/operating-systems",
  ssd: "https://www.ibm.com/think/topics/flash-vs-ssd-storage",
  gps: "https://archive.gps.gov/systems/gps/",
  gpsSpace: "https://www.gps.gov/space-segment",
  gpsControl: "https://www.gps.gov/control-segment",
  cisa: "https://www.cisa.gov/sites/default/files/2025-01/Secure-Our-World-Online-Safety-for-Older-Adults-Tip-Sheet.pdf",
  phishing: "https://www.cisa.gov/sites/default/files/2023-09/CISA_Web-Page-Animation_Four-Easy-Ways_Audio-Description.pdf",
  passwords: "https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-Passwords-Tip-Sheet.pdf",
  mfa: "https://www.cisa.gov/sites/default/files/2025-09/Poster2%20-%20Practice%20These%20Four%20Essentials%20-%20CAMToolkit2025.pdf",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trae001", "easy", "technology", "Bilgisayarın fiziksel parçalarının genel adı nedir?", ["Donanım", "Yazılım", "İnternet", "Dosya"], "IBM, bilgisayarın fiziksel parçalarını donanım olarak tanımlar.", "hardware"],
  ["trae002", "easy", "technology", "Bilgisayarda komutları işleyip hesap yapan ana bileşen hangisidir?", ["İşlemci (CPU)", "Hoparlör", "Yazıcı", "Fare"], "IBM, CPU'nun yönergeleri işleyip hesaplamaları yaptığını açıklar.", "hardware"],
  ["trae003", "medium", "technology", "Bilgisayarda geçici çalışma belleği hangisidir?", ["RAM", "SSD", "DVD", "Yazıcı"], "IBM, RAM'i işlem sırasında kullanılan bellek olarak tanımlar.", "hardware"],
  ["trae004", "medium", "technology", "Bilgisayarda kalıcı dosyaları saklamak için hangisi kullanılır?", ["SSD", "RAM", "İşlemci", "Ekran"], "IBM, SSD'yi güç kesilse de veri saklayan depolama aygıtı olarak açıklar.", "ssd"],
  ["trae005", "medium", "technology", "SSD'leri dönen diskli sabit sürücülerden ayıran özellik hangisidir?", ["Hareketli parça içermemeleri", "Yalnız kâğıda basmaları", "Sadece ses üretmeleri", "İnternete ihtiyaç duymaları"], "IBM, SSD'lerin hareketli mekanik parça içermediğini belirtir.", "ssd"],
  ["trae006", "easy", "technology", "Bilgisayarın donanımını ve uygulamalarını yöneten temel yazılım hangisidir?", ["İşletim sistemi", "Elektrik prizi", "Monitör", "Kablo"], "IBM, işletim sistemini donanım ve uygulamaları yöneten yazılım olarak tanımlar.", "os"],
  ["trae007", "medium", "technology", "Bilgisayara kâğıt belgeyi aktaran giriş aygıtı hangisidir?", ["Belge tarayıcısı", "Hoparlör", "Projeksiyon", "Yazıcı"], "IBM, belge tarayıcılarını giriş aygıtları arasında sayar.", "hardware"],
  ["trae008", "medium", "technology", "Bilgisayarın kullanıcıya ses iletmesini sağlayan çıkış aygıtı hangisidir?", ["Hoparlör", "Klavye", "Fare", "Tarayıcı"], "IBM, hoparlörleri çıkış aygıtı olarak sınıflandırır.", "hardware"],
  ["trae009", "easy", "technology", "GPS en çok hangi amaçla kullanılır?", ["Konum ve yön bulma", "Yazı basma", "Film kurgulama", "Pil doldurma"], "GPS.gov, GPS'nin konum, seyir ve zamanlama hizmetleri verdiğini açıklar.", "gps"],
  ["trae010", "medium", "technology", "GPS'nin uzay bölümü hangi araçlardan oluşur?", ["Uydular", "Denizaltılar", "Trenler", "Radyo kuleleri"], "GPS.gov, uzay bölümünü radyo sinyali yayan uydu takımyıldızı olarak tanımlar.", "gpsSpace"],
  ["trae011", "medium", "technology", "GPS alıcısı konumu hesaplamak için öncelikle neyi alır?", ["Uydu sinyallerini", "Basılı haritaları", "Televizyon yayınlarını", "Yol çizgilerini"], "GPS.gov, alıcıların uydu sinyallerinden konum hesapladığını açıklar.", "gps"],
  ["trae012", "hard", "technology", "GPS'nin yeryüzündeki kontrol istasyonları başlıca neyi izler?", ["Uyduları ve sinyallerini", "Okyanus balıklarını", "Şehir otobüslerini", "Televizyon dizilerini"], "GPS.gov, kontrol bölümünün uyduları izleyip komut gönderdiğini açıklar.", "gpsControl"],
  ["trae013", "medium", "technology", "GPS uyduları kullanıcılara hangi tür sinyal gönderir?", ["Radyo sinyali", "Sesli telefon araması", "Basılı mektup", "Lazer yazıcı çıktısı"], "GPS.gov, uyduların radyo sinyalleri yayınladığını belirtir.", "gpsSpace"],
  ["trae014", "easy", "technology", "Telefon veya bilgisayar yazılımını güncellemek en çok hangi bakımdan yararlıdır?", ["Güvenlik açıklarının giderilmesi", "Ekranın fiziksel büyümesi", "Pil türünün değişmesi", "Klavye sayısının artması"], "CISA, yazılım güncellemelerinin güvenliği ve işlevi iyileştirdiğini açıklar.", "cisa"],
  ["trae015", "medium", "technology", "Şüpheli bir iletideki bağlantıya tıklamadan önce neyi doğrulamak gerekir?", ["Gönderenin kimliğini", "Ekranın parlaklığını", "Telefonun rengini", "Kablonun uzunluğunu"], "CISA, oltalama girişimlerinde göndereni doğrulamayı önerir.", "phishing"],
  ["trae016", "medium", "technology", "Güvenilir bir kurumdan gelmiş gibi görünen sahte iletilerle bilgi çalma girişimine ne denir?", ["Oltalama", "Yedekleme", "Sıkıştırma", "Biçimlendirme"], "CISA, güvenilir görünen sahte mesajları oltalama girişimi olarak tanımlar.", "phishing"],
  ["trae017", "medium", "technology", "Parola yöneticisinin temel işi hangisidir?", ["Parolaları oluşturup saklamak", "Ekranı temizlemek", "İnternet hızını ölçmek", "Dosyaları yazdırmak"], "CISA, parola yöneticisinin parolaları oluşturup saklayabildiğini açıklar.", "passwords"],
  ["trae018", "medium", "technology", "Farklı hesaplarda aynı parolayı kullanmanın yerine hangisi önerilir?", ["Her hesap için benzersiz parola", "Tek kısa parola", "Parola kullanmamak", "Parolayı herkese göndermek"], "CISA, her hesapta benzersiz parola kullanılmasını önerir.", "passwords"],
  ["trae019", "medium", "technology", "Telefonun kaybolması durumunda içindeki bilgilere erişimi zorlaştırmak için ne kullanılır?", ["Ekran kilidi", "Daha parlak ekran", "Daha büyük yazı", "Duvar kâğıdı"], "CISA, kayıp cihazlarda bilgi korunması için parola, parmak izi veya yüz tanımayla kilit önerir.", "cisa"],
  ["trae020", "medium", "technology", "İki aşamalı veya çok faktörlü girişin amacı nedir?", ["Hesaba ek doğrulama eklemek", "Ekran çözünürlüğünü artırmak", "Dosyayı sıkıştırmak", "Pili değiştirmek"], "CISA, çok faktörlü doğrulamayı hesaplara ek güvenlik katmanı olarak tanımlar.", "mfa"],
];

export const turkishBalanceEighteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

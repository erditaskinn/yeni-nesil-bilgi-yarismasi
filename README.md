# Yeni Nesil Bilgi Yarışması

Türkçe, tek kişilik, üyeliksiz bilgi yarışması. Dört zorluk seviyesinde kaynakları belirtilmiş toplam 48 soru içerir. Her turda seçilen seviyeden 10 benzersiz soru gelir. Cevap sonrasında doğru seçenek ve kısa açıklama gösterilir; sonuç paylaşılabilir ve her seviyenin en yüksek puanı cihazda tutulur.

Next.js App Router 16, React 19, katı TypeScript ve Tailwind CSS 4 kullanır. Tamamen statik olarak dışa aktarılır; uygulama sunucusu, veritabanı, hesap veya gizli anahtar gerektirmez. Analiz, reklam ve çerez eklenmemiştir.

Arama motorları için ana sayfaya ek olarak dört ayrı, statik seviye rehberi bulunur: `/kolay-bilgi-yarismasi`, `/orta-bilgi-yarismasi`, `/zor-bilgi-yarismasi` ve `/cok-zor-bilgi-yarismasi`. Bu sayfalar oyundan örnek soruları, kısa açıklamalarını ve kaynak bağlantılarını gösterir. Her sayfanın kendine özgü başlığı, açıklaması ve canonical adresi vardır. Sitemap bu beş sayfayı listeler; WebSite ve BreadcrumbList yapılandırılmış verileri gerçek sayfa içeriğiyle uyumludur. Bu teknik hazırlık sıralama garantisi değildir.

## Kurulum ve çalıştırma

Node.js 24 LTS ve npm kullanılması önerilir. Bağımlılıklar `package-lock.json` ile sabitlenmiştir.

```sh
npm ci
npm run dev
```

Geliştirme adresi: http://localhost:3000. Port doluysa `npm run dev -- --port 3001` kullanın.

## Kontroller

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

`npm test`, Node test runner ve tsx ile oyun mantığı ve depolama testlerini çalıştırır. E2E testleri **önceden oluşturulmuş `out/` production çıktısını** port 3100 üzerinde otomatik sunar. Port 3100'de farklı veya eski bir uygulama çalıştırmayın.

Playwright varsayılan olarak sistemdeki Microsoft Edge'i kullanır. Edge yoksa `npx playwright install chromium` çalıştırın ve `playwright.config.ts` içindeki `channel: "msedge"` alanını kaldırın. Testler masaüstü, iPhone ve iPad ekranlarını Chromium üzerinde emüle eder; gerçek iOS/Safari cihaz testinin yerini tutmaz.

Tarayıcı testleri tam oyun, yeniden oynama, süre aşımı, çıkış onayı, klavye kullanımı, yüksek skor, paylaşım yedekleri, depolama reddi, sayfa yenileme, SEO, 404 ve yatay taşmayı denetler. axe ile WCAG A/AA otomatik kontrolleri yapılır. Test ekran görüntüleri `test-results/` altında tutulur.

## Production

```sh
npm run build
npm start
```

Build, dağıtıma hazır `out/` klasörünü üretir. `npm start`, bu klasörü yerelde port 3000'de sunar; Next.js sunucusu başlatmaz. Farklı port: `npm exec serve -- out --listen 3001`.

## Klasör yapısı

```text
src/app/                    Sayfa, global stil, hata/404, SEO ve kapak görseli
src/components/             Ana sayfa, seviye, oyun, sonuç ve çıkış penceresi
src/data/questions.ts       Kaynaklı soru havuzu
src/lib/config.ts           Oyun ayarları, seviyeler ve alan adı
src/lib/level-pages.ts      Seviye rehberlerinin metinleri, yolları ve meta verileri
src/lib/types.ts            Soru ve cevap modeli
src/lib/game.ts             Saf oyun kuralları ve durum geçişleri
src/lib/question-repository.ts  Veri kaynağı arayüzü
src/lib/storage.ts          Hata toleranslı yerel yüksek skor kaydı
tests/game.test.ts          Veri, oyun ve depolama testleri
tests/e2e/quiz.spec.ts       Tarayıcı ve erişilebilirlik testleri
public/icon.svg             Geçici marka işareti
out/                        Üretilen statik dağıtım
deploy/nginx-http.conf      Sertifika öncesi HTTP sunucu bloğu
deploy/nginx-https.conf     HTTPS ve canonical yönlendirme yapılandırması
```

## Yeni soru eklemek

`src/data/questions.ts` içindeki `sources` listesine güvenilir, doğrudan kaynağın HTTPS adresini ekleyin. Havuzdaki `q(...)` örneklerini takip edin:

```ts
q(
  "benzersiz-kimlik",
  "easy", // easy | medium | hard | expert
  "Kategori",
  "Açık ve tek anlamlı soru?",
  ["Doğru seçenek", "Yanlış seçenek 1", "Yanlış seçenek 2", "Yanlış seçenek 3"],
  "Kaynakla doğrulanmış kısa açıklama.",
  "sourcesListesindekiAnahtar",
);
```

Bu yardımcı yalnızca veri yazmayı kolaylaştırır: **yazım sırasında ilk seçenek doğrudur**. Gerçek `Question` nesnesi `id`, `difficulty`, `category`, `question`, `choices`, `correctAnswer`, `explanation`, `sourceUrl`, `reviewedAt` içerir. Her seçeneğin sabit kimliği vardır; oyun başlarken seçenekler karıştırılır ve doğru yanıtın kimliği korunur. Doğrudan `Question` nesnesi de eklenebilir.

`reviewedAt` gerçek içerik incelemesinin tarihi olmalıdır. Mevcut başlangıç seti 27 Eylül 2026'da kaynaklarla karşılaştırılmıştır. Yeni sorular için yardımcıdaki ortak tarihi sessizce değiştirmek yerine ilgili nesneye kendi tarihinizi verin; örneğin `{ ...q(...), reviewedAt: "2026-10-01" }`. Yanıtı, açıklamayı ve tüm çeldiricileri birlikte kontrol edin. Sorunun sonuna gelindiğinde kaynak bağlantısı oyuncuya da sunulur.

İsteğe bağlı `image: { src, alt, width, height }` alanı görsel soruları destekler. Görseli `public/` altında optimize edilmiş WebP/AVIF olarak saklayın, açıklayıcı alternatif metin kullanın. Statik export nedeniyle çalışma zamanında Next.js görsel optimizasyon servisi kullanılmaz.

Her seviyede en az 12 soru tutun. `npm test` soru kimliklerini, seçenek benzersizliğini, tek doğru yanıtı, kaynak/tarih alanlarını ve her seviyenin yeterliliğini kontrol eder. Bu kontroller içerik editörünün bilgi doğrulamasının yerine geçmez.

Kaynaklar arasında [NASA](https://science.nasa.gov/solar-system/planets/), [UNESCO](https://whc.unesco.org/en/list/), [Royal Society of Chemistry](https://periodic-table.rsc.org/), [Nobel Prize](https://www.nobelprize.org/), Louvre, MoMA, Prado ve FIDE bulunur. Açıklamalar kısa Türkçe ifadelerle yazılmıştır; kaynak görselleri veya uzun metinleri kopyalanmamıştır.

Gelecekte veri kaynağını değiştirmek için `QuestionRepository.getByDifficulty` uygulamasını değiştirin. Oyun motoru kaynak verinin nereden geldiğini bilmez. API eklenirse yanıtın çalışma zamanında şema doğrulaması da eklenmelidir.

## Oyun ayarları

Tek merkez: `src/lib/config.ts` içindeki `GAME_CONFIG`.

- `questionCount`: 10
- `secondsPerQuestion`: 20
- `basePoints`: 100
- `pointsPerSecond`: 5

Formül `calculatePoints` fonksiyonundadır: doğru cevap için `100 + kalan tam saniye × 5`; yanlış veya süresi geçmiş cevap için 0. Görünen süre yukarı yuvarlanır, böylece 0 saniye gösterilen anda cevap kabul edilmez. Sayaç gerçek bir bitiş zamanından hesaplanır; sekme arka plana alınması veya çıkış penceresi açılması süreyi durdurmaz. Aynı soruya ikinci yanıt ve eski sorudan gelen olaylar yok sayılır.

Soru sayısı değiştirilirse ana sayfa metinleri, SEO metni ve 10 soruya göre yazılmış test beklentileri de gözden geçirilmelidir. Sayaç ve puan değerleri doğrudan merkezi ayarı kullanır.

Yenileme ana sayfadan temiz başlangıç yapar. Yalnızca tamamlanan turların rekorları `ynby:high-scores:v1` anahtarıyla localStorage'a yazılır. Veri bozuksa veya depolama engelliyse oyun çalışır; kalıcı rekor tutulamayabilir. Tarayıcı verisi temizlenirse rekorlar silinir; cihazlar arasında eşitlenmez.

## Paylaşım ve erişilebilirlik

Web Share API varsa cihazın paylaşım penceresi açılır. Yoksa veya paylaşım başarısız olursa panoya kopyalama denenir. Kullanıcının paylaşımı iptal etmesi hata sayılmaz. Panoya da erişilemiyorsa seçilebilir metin sunulur. Production'da HTTPS kullanın. Paylaşım metninde kişisel veri yoktur.

Butonlar klavye ile kullanılabilir; odak stilleri, soru geçişinde odak yönetimi, sonuç ve son 5 saniye için canlı bölgeler bulunur. Çıkış penceresi yerel `<dialog>` ile odağı içeride tutar; Escape ile kapanır. Doğru/yanlış durumları renk yanında simge ve metinle belirtilir. Azaltılmış hareket tercihi desteklenir.

## Dağıtım ve domain

Hedef Hetzner sunucusu `46.225.120.184`, DNS sağlayıcısı Güzel Hosting'dir. Statik çıktının yayın dizini `/var/www/yeninesilbilgiyarismasi` ve Nginx site adı `yeninesilbilgiyarismasi` olarak kullanılır. Bu adlar mevcut sitelerden ayrıdır. 27 Eylül 2026'da DNS A kaydı Hetzner'e taşındı; iki alan adı için Let's Encrypt sertifikası alındı ve `deploy/nginx-https.conf` etkinleştirildi. HTTP/`www` yönlendirmeleri, HTTPS ana sayfa, sitemap, 404 ve sertifika yenileme provası doğrulandı. Yeni dağıtımlarda güncel durumu yeniden kontrol edin.

1. Yerelde `npm ci`, kontroller ve `npm run build` çalıştırın. `out/` içeriğini sunucudaki yayın dizinine aktarın. Eski bir sürümü değiştirirken önce yedek veya sürümlü yayın düzeni kullanın.
2. İlk kurulumda `deploy/nginx-http.conf` dosyasını `/etc/nginx/sites-available/yeninesilbilgiyarismasi` konumuna yerleştirip `sites-enabled` altında etkinleştirin. `nginx -t` başarılıysa Nginx'i yeniden yükleyin.
3. Güzel Hosting DNS panelinde kök `@` A kaydını `46.225.120.184` olarak ayarlayın. `www` CNAME kaydı kök domaine işaret etmeye devam edebilir. Kullanılmayan eski A/AAAA kayıtlarını ve DNSSEC durumunu ayrıca kontrol edin. DNS yayılımını iki alan adı için doğrulayın.
4. İki alan adı sunucuya çözümlendiğinde Certbot ile `yeninesilbilgiyarismasi.com` ve `www.yeninesilbilgiyarismasi.com` için HTTPS sertifikası alın. Ardından aynı Nginx site dosyasını `deploy/nginx-https.conf` içeriğiyle değiştirin; `nginx -t` ve reload yapın. Bu yapılandırma HTTP ve `www` isteklerini canonical `https://yeninesilbilgiyarismasi.com` adresine yönlendirir, ACME doğrulama yolunu açık tutar. Sertifika yenilemesini `certbot renew --dry-run` ile denetleyin.
5. Canlı sitede oyun, dört seviye sayfası, `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/opengraph-image.png` ve 404 yanıtını test edin. Google Search Console'da mülkü doğrulayıp sitemap gönderin. İndekslenme ve sıralama zaman alabilir; sonuç vaat edilmez.

Domain bağlantısı Güzel Hosting panelinde yapılmıştır. Google Search Console mülk doğrulaması ve sitemap gönderimi henüz ayrıca yapılmalıdır. Şifre veya gizli anahtarları kaynak koda ya da README'ye yazmayın.

## Bilinen sınırlar

- Başlangıç havuzu seviye başına 12 sorudur; farklı turlarda sorular tekrar gelebilir, tek turda tekrar etmez.
- Zorluk etiketleri editoryal başlangıç sınıflandırmasıdır; kullanıcı araştırmasıyla kalibre edilmemiştir.
- Cevaplar ve skor hesaplama istemcidedir; rekabetçi/ödüllü kullanım için hile koruması amaçlanmamıştır.
- Otomatik erişilebilirlik testi, ekran okuyucuyla manuel kullanıcı testinin yerini tutmaz.
- Native paylaşım penceresi ve Safari davranışları gerçek cihazda ayrıca denenmelidir.

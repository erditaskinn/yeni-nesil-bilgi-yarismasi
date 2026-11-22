# Yeni Nesil Bilgi Yarışması

Türkçe ve İngilizce, tek kişilik, üyeliği isteğe bağlı bilgi yarışması. Kaynakları belirtilmiş 620 soru içerir; çeviriler ayrı soru sayılmaz. Kullanıcı kategori, seviye ve tur türünü seçer: kısa, standart, uzun, sonsuz veya yanlışlarım. Günlük tur her zaman 10 sorudur. Her soruda 20 saniye, mevcut puanlama, açıklama ve kaynaklar korunur. Tam standart tur rekorları isteğe bağlı hesapla eşitlenir; diğer tur rekorları cihazda ayrı tutulur. Ayrıntılar ve doğrulama raporu: [Tur seçenekleri](docs/rounds-20260929.md).

Next.js App Router 16, React 19, katı TypeScript ve Tailwind CSS 4 kullanır. Tamamen statik olarak dışa aktarılır; uygulama sunucusu, veritabanı, hesap veya gizli anahtar gerektirmez. Analiz, reklam ve çerez eklenmemiştir.

Arama motorları için ana sayfaya ek olarak dört statik seviye rehberi ve dört kategori sayfası bulunur. Bu sayfalar oyundan örnek soruları, kısa açıklamalarını ve kaynak bağlantılarını gösterir. Her sayfanın kendine özgü başlığı, açıklaması ve canonical adresi vardır. Sitemap dokuz sayfayı listeler; WebSite ve BreadcrumbList yapılandırılmış verileri gerçek sayfa içeriğiyle uyumludur. Bu teknik hazırlık sıralama garantisi değildir.

**Yayın durumu:** 28 Eylül 2026'da (Türkiye saati) günlük 10 soru, dört kategori rehberi, dört mevcut soruya bağlı üç görsel ve isteğe bağlı cihaz istatistikleri Hetzner'e yayımlandı. Mevcut 500 soru, karışık/kategorili oyun, yakın tekrarları azaltma ve yanlışları çalışma korundu. Lint, tip kontrolü, 27 mantık testi, 35 farklı masaüstü/mobil/tablet tarayıcı senaryosu ve production build başarılı. Canlı domain üzerinde masaüstü ve mobil yeni akışlar, kategori sayfaları, görseller, sitemap, robots, 404 ve canonical yönlendirmeler ayrıca doğrulandı. Kaynak kodu [GitHub deposunda](https://github.com/erditaskinn/yeni-nesil-bilgi-yarismasi) sürümlenir. Sunucuya yayın ve GitHub kaynak yedeği ayrı işlemlerdir; biri diğerini otomatik güncellemez.

Bu yayın öncesi sunucu yedeği: `/var/www/yeninesilbilgiyarismasi-backup-before-daily-20260928-000242` (UTC). Yerel kaynak yedeği: `.backups/before-daily-discovery-20260928.zip`. Yeni dağıtım arşivi: `.backups/ynby-daily-discovery-20260928.tgz`; SHA-256: `dca5a46cbe3d292bcc9400625db13eb49363f8b01a28d2aab12a253a0d3277ce`. Önceki yedekler ve eski `_next/` paketleri korunmuştur. Nginx kontrolünde başka siteye (`kangarogo`) ait mevcut IPv6 protokol uyarısı görülür; sözdizimi kontrolü başarılıdır ve bu görevde o yapılandırma değiştirilmemiştir.

Yayın öncesi sunucu yedeği: `/var/www/yeninesilbilgiyarismasi-backup-before-learning-20260927-231723` (sunucunun UTC zaman damgası). Yerel kaynak yedeği: `.backups/before-learning-2026-09-28.zip`. Dağıtım arşivi: `.backups/ynby-learning-20260928.tgz`; SHA-256: `11edc248d83cffb77ffe64d71d2fcd1022bbe83bc0c4f0a41e01c52c1160a223`. Önceki kategori yedeği ve 27 Eylül sunucu yedeği korunmuştur. Açık eski tarayıcı sekmelerinin paketlerini bulabilmesi için önceki `_next/` dosyaları yayında şimdilik tutulur; disk kullanımı gelecekte kontrollü temizlenmelidir.

**Son yayın:** 28 Eylül 2026'da 580 soruluk havuz ve 301 sorunun zorluk düzeltmesi Hetzner'e yayımlandı. Türkçe ve İngilizce canlı oyunlar masaüstü, telefon ve tablette altı tarayıcı senaryosuyla doğrulandı; sitemap'teki 18 URL, görseller, 404 ve canonical yönlendirmeler kontrol edildi. Yayın paketiyle sunucu dosyalarının checksum karşılaştırması fark vermedi. İnceleme ölçütleri, dağılım, paket ve sunucu yedeği `docs/question-difficulty.md` içindedir. Bu yayın kaynak kodunu GitHub'a otomatik göndermez.

## Yarışma Akışı Ve Kategoriler

`Bilgini Test Et` sonrasında **Karışık Sorular**, **Uzay**, **Bilim ve Doğa**, **Tarih ve Coğrafya** veya **Sanat ve Kültür** seçilir. Ardından Kolay, Orta, Zor veya Çok Zor ve `Turunu seç` ekranı gelir. Merkezi `src/lib/rounds.ts` kısa (5), standart (10), uzun (20), sonsuz, yanlışlarım ve günlük (10) tur kurallarını tanımlar. Eksik havuzda kart, başlamadan önce gerçek soru sayısını bildirir. Kategori ve seviye dışına çıkılmaz, aynı turda soru tekrarlanmaz.

Mevcut `ynby:high-scores:v1` ve kategori/hesap uzantıları standart tur için korunur. Diğer tur türleri ayrı anahtarlar kullanır; yanlışlarım ve günlük tur rekorlara eklenmez. Seviye rehberi bağlantıları seçilen kategori ve seviyeyi koruyarak tur seçimini açar. Hesap ve sunucu veri modeli değiştirilmez.

## Tekrar azaltma ve öğrenme

Soru seçiminde mevcut cihaz geçmişi dikkate alınır. Önce görülmemiş sorular, ardından en eski görülenler seçilir; kategori ve zorluk filtreleri aşılmaz. Sonlu turda seçilen, sonsuz turda yalnızca gösterilen soru kimlikleri mevcut 500 kimliklik geçmişe eklenir. Depolama engellenirse yarışma bellekte devam eder.

**Yanlışlarımı İncele** ve süresiz/puansız **Yanlışlarımı Çalış** korunur. Yeni **Yanlışlarım** turu, seçilen kategori ve seviyedeki önceki yanlışları getirir; doğru öğrenilen sorular geçmişten çıkarılır. İstatistik izni varsa son 100 turun soru kimlikleri cihazda tutulur; izin yoksa yalnızca oturum belleği kullanılır. Aktif turun geçici sekme kaydı yenilemede soruyu, sırayı, puanı ve gerçek bitiş zamanını geri getirir. Sonuç ekranındaki ayrı çalışma görünümü yenilemede sonuç özetine döner. Uygulama işlemi öldürülürse sekme kaydının Android tarafından korunması garanti edilmez.

28 Eylül 2026 kalite kontrolünde tüm 500 kaydın yapısı ve kategori/seviye dağılımı otomatik denetlendi; metin benzerliği ve aynı kaynak/yanıt kümeleri incelendi. 21 soru yeniden yazıldı; değişen bilgiler NASA, RSC, FIDE, Nobel, UNESCO ve müzelerin kendi sayfalarından kontrol edildi. Bu tarama, tüm bilgi havuzunun bağımsız bir editör tarafından eksiksiz doğrulandığı anlamına gelmez. Zorluklar henüz kullanıcı başarı oranlarıyla kalibre edilmemiştir. Yeni geliştirme öncesi kaynak yedeği `.backups/before-learning-2026-09-28.zip` dosyasındadır.

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
src/data/questions.ts       İlk 240 soru ve birleştirilmiş havuz
src/data/questions-expanded.ts   Kategori ve seviyeye ayrılmış 260 yeni soru
src/lib/config.ts           Oyun ayarları, seviyeler ve alan adı
src/lib/level-pages.ts      Seviye rehberlerinin metinleri, yolları ve meta verileri
src/lib/category-pages.ts   Kategori rehberleri, yollar ve meta verileri
src/lib/daily.ts            Türkiye tarihli, belirlenimli günlük soru seçimi
src/lib/statistics.ts       İsteğe bağlı, sınırlandırılmış cihaz istatistikleri
src/data/question-images.ts  Soru-görsel eşleştirmesi ve kaynak bilgisi
src/lib/types.ts            Soru ve cevap modeli
src/lib/game.ts             Saf oyun kuralları ve durum geçişleri
src/lib/practice.ts         Süresiz, puansız çalışma durum geçişleri
src/lib/question-repository.ts  Veri kaynağı arayüzü
src/lib/storage.ts          Hata toleranslı yerel rekor ve soru geçmişi
tests/game.test.ts          Veri, oyun ve depolama testleri
tests/daily-statistics.test.ts  Günlük tur, istatistik ve görsel testleri
tests/e2e/new-modes.spec.ts  Yeni akışların tarayıcı testleri
tests/e2e/quiz.spec.ts       Tarayıcı ve erişilebilirlik testleri
public/icon.svg             Geçici marka işareti
public/questions/          Optimize görseller ve LICENSES.md kayıtları
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

`reviewedAt` gerçek içerik incelemesinin tarihi olmalıdır. İlk 200 soru 27 Eylül 2026'da, ardından eklenen 300 soru 28 Eylül 2026'da hazırlandı. Yeni sorular için yardımcıdaki ortak tarihi sessizce değiştirmek yerine `q(...)` çağrısında kaynak anahtarından sonra inceleme tarihini belirtin; örneğin `q("id", "easy", "Bilim", "Soru?", ["Doğru", "Yanlış 1", "Yanlış 2", "Yanlış 3"], "Açıklama.", "kaynak", "2026-10-01")`. Yanıtı, açıklamayı ve tüm çeldiricileri birlikte kontrol edin. Sorunun sonuna gelindiğinde kaynak bağlantısı oyuncuya da sunulur.

İsteğe bağlı `image: { src, alt, width, height, credit, licenseUrl }` alanı görsel soruları destekler. Eşleştirmeler `src/data/question-images.ts` dosyasındadır. İlk set dört mevcut soruya bağlı üç WebP görselidir: dünya haritası, Ay yüzeyi ve Japon sanat baskısı. Kaynak/kullanım kayıtları `public/questions/LICENSES.md` içindedir. Alternatif metin doğru cevabı ifşa etmez; görsel yüklenemediğinde soru metinden cevaplanabilir. Kaynak ve atıf cevap geri bildiriminde görünür. Statik export nedeniyle çalışma zamanında Next.js görsel optimizasyon servisi kullanılmaz.

28 Eylül 2026 zorluk incelemesiyle havuz 580 soruya çıkarıldı. 301 mevcut sorunun seviyesi değiştirildi; her kategoriye 20 yeni soru eklendi. Güncel dağılım ve editoryal ölçütler [soru inceleme notlarında](docs/question-difficulty.md) bulunur. Seviyeleri eşit sayıya zorlamayın: her kategori/seviyede en az 10 soru gereklidir. `npm test` toplam sayıyı, yeterli havuzları, soru kimliklerini ve metinlerini, seçenek benzersizliğini, tek doğru yanıtı ve kaynak/tarih alanlarını kontrol eder. Otomatik testler içerik doğrulamasının ve gerçek oyuncu araştırmasının yerine geçmez.

`src/data/difficulty-review.ts` mevcut kayıtların editoryal seviye düzeltmelerini içerir; soru kimliklerinin eski `e/m/h/x` ön ekleri güncel seviyeyi belirlemez. `src/data/questions-foundations.ts` 80 yeni soruyu, `src/data/en/foundations.ts` eşleşen İngilizce metinleri tutar. Yeni sorularda tarih/seviye/kategori/kaynak açıkça belirtilir. Kaynağı yeniden doğrulamadan yalnızca zorluk değiştirildiğinde `reviewedAt` değiştirilmez. Bir kimliği yeniden sınıflandırırken seviye rehberlerindeki örnekleri ve günlük tur sürümünü de denetleyin.

Kaynaklar arasında [NASA](https://science.nasa.gov/solar-system/planets/), [UNESCO](https://whc.unesco.org/en/list/), [NOAA](https://oceanservice.noaa.gov/), [Royal Society of Chemistry](https://periodic-table.rsc.org/), [Nobel Prize](https://www.nobelprize.org/), Louvre, MoMA, Prado, Metropolitan Müzesi ve FIDE bulunur. Açıklamalar kısa Türkçe ifadelerle yazılmıştır; uzun kaynak metinleri kopyalanmamıştır. Eklenen görseller için ayrı lisans/kullanım kayıtları tutulur.

Gelecekte veri kaynağını değiştirmek için `QuestionRepository.getByDifficulty` ve günlük tur için kullanılan `getAll` uygulamalarını değiştirin. Oyun motoru kaynak verinin nereden geldiğini bilmez. API eklenirse yanıtın çalışma zamanında şema doğrulaması da eklenmelidir.

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

Domain bağlantısı Güzel Hosting panelinde yapılmıştır. Google Search Console mülk doğrulaması ve sitemap gönderimi tamamlanmıştır; dizine eklenme ve sıralama Google'ın süreçlerine bağlıdır. Şifre veya gizli anahtarları kaynak koda ya da README'ye yazmayın.

## Günlük tur, kategori keşfi ve istatistikler

- **Günlük 10 Soru:** Ana sayfadaki ayrı düğmeyle ya da `/?mod=gunluk` adresiyle başlar. `src/lib/daily.ts` Türkiye saatine (Europe/Istanbul) göre tarihi ve tohumlu seçimi belirler. Aynı gün aynı soru ve seçenek sırası kullanılır; 2 kolay, 3 orta, 3 zor, 2 çok zor soru gelir. Tarih turun başında sabitlenir. Günlük tur normal kategori/seviye rekoruna yazılmaz; tekrar oynama aynı gün aynı seti getirir. Gelecek günün turu gece yarısından sonra yeni başlangıçta seçilir.
- Günlük v1 havuzu `e01..e125`, `m01..m125`, `h01..h125`, `x01..x125` kimliklerine sabittir. 28 Eylül 2026 ve öncesinde eski kimlik grupları kullanılarak önceki soru/seçenek sırası korunur; bu eski turların güncel zorluk dağılımı 2/3/3/2 olmayabilir. 29 Eylül 2026'dan itibaren v2, aynı kimlikler ve `r001..r080` üzerinden güncel seviyelerle 2/3/3/2 seçer. Daha sonraki eklemeler bu sabit kümelere kendiliğinden girmez. Kimlikleri silmek, metinleri veya seviyeleri değiştirmek günlük seti etkileyebilir; sürüm geçişlerini gün sınırına göre planlayın. Tarih cihaz saatine dayanır; sunucu saati doğrulaması veya günlük rekabet sıralaması yoktur.
- **Kategori sayfaları:** `/uzay-bilgi-yarismasi`, `/bilim-ve-doga-bilgi-yarismasi`, `/tarih-ve-cografya-bilgi-yarismasi`, `/sanat-ve-kultur-bilgi-yarismasi`. Özgün açıklamalar, dört seviyeden kaynaklı örnekler ve ilgili kategoriye doğrudan oyun bağlantıları içerir. Metadata/canonical ve breadcrumb verileri `src/lib/category-pages.ts` / `src/components/category-guide.tsx` üzerinden hazırlanır. Sitemap iki dilde ana sayfa, dört seviye ve dört kategori olmak üzere 18 URL içerir. Sorgu parametreleri ayrı sitemap sayfaları değildir.
- **Search Console:** Mevcut sitemap adresini yeniden okutun; dört yeni URL'yi URL Denetimi ile test edip dizine eklenmesini isteyin. Performans > Arama sonuçları ekranında sayfa filtresiyle her kategori URL'sini seçin; Sorgular bölümünde gösterim, tıklama, TO ve ortalama konumu 28 günlük dönemlerle karşılaştırın. Search Console hesabına erişim olmadan rapor takibi yapılamaz. İndekslenme veya sıralama garantisi yoktur; anahtar kelime doldurma, sahte puanlama ve kopya sayfalar eklenmez.
- **İstatistiklerim:** Ana sayfadaki düğmeyle açılır, varsayılan kapalıdır. Kullanıcı açarsa yalnızca yeni tamamlanan son 100 tur `ynby:statistics:v1` ile cihazda saklanır. Tur kimliği çift kayıtları önler; günlük tur ayrı kategori olarak gösterilir. Yanlışları çalışma turları kaydedilmez. Kapatma kayıtları siler; açıkken Kayıtları Sil sıfırlar. Depolama engelli olduğunda kayıt yapılamadığı bildirilir, oyun etkilenmez. Hesap, çerez, dış analiz veya cihazlar arası eşitleme yoktur.
- Yeni mantık testleri `tests/daily-statistics.test.ts`, uçtan uca testler `tests/e2e/new-modes.spec.ts` içindedir. Masaüstü, telefon ve tablet boyutlarında günlük turun tamamlanması, paylaşım, tekrar, istatistik onayı/silme, kategori bağlantıları, canonical, kaynaklar, görsel yüklenmesi, taşma ve otomatik erişilebilirlik denetlenir.

## Türkçe ve İngilizce

Türkçe ana sayfa `/`, İngilizce ana sayfa `/en` adresindedir. Üst alandaki Türkçe / English bağlantıları dil değiştirir; devam eden turda yanlışlıkla ilerlemenin kaybolmaması için gösterilmez. Dil otomatik yönlendirilmez ve çerez kullanılmaz. Kategori/seviye rehberlerinde dil değiştirme aynı rehberin karşılığına gider.

- `src/lib/locale.ts`: Arayüz metinleri, seviye/kategori etiketleri, sayı ve yüzde biçimi.
- `src/data/en/{easy,medium,hard,expert}.ts`: İlk 500 sorunun İngilizce metinleri. Dosya adları ilk sınıflandırmayı belirtir; güncel seviye Türkçe kayıt ve inceleme düzeltmesinden alınır. `src/data/en/foundations.ts` 80 ek sorunun çevirisidir.
- `src/data/questions-en.ts`: Çeviriyi Türkçe kaynaktaki sabit soru/seçenek kimlikleri, kaynak, inceleme tarihi ve kategoriyle birleştirir. Eksik veya çift kimlik sessizce Türkçeye dönmez; doğrulama hatası verir. Görsellerin İngilizce alternatif metinleri burada tutulur.
- `src/lib/question-repository.ts`: Dil bazlı veri kaynağı; İngilizce havuz oyun başladığında yüklenir. `category` teknik anahtarı ortak Türkçe veri değeri olarak kalır, ekranda `topicLabel` ile çevrilir.
- `src/app/(tr)` ve `src/app/(en)/en`: Ayrı kök düzenleri sayesinde statik HTML baştan doğru `lang` değerini taşır. Türkçe URL'ler değişmez.
- `src/app/global-not-found.tsx`: Ayrı kök düzenleri için Next.js'in `experimental.globalNotFound` mekanizmasıyla genel Türkçe 404 hazırlanır; HTML dili ve stil korunur. İngilizce Nginx 404 çıktısı `/en/404.html` dosyasıdır. Next.js yükseltmelerinde bu mekanizmanın statik export davranışını yeniden test edin.
- `src/lib/english-pages.ts`, `site-metadata.ts`: İngilizce SEO içerikleri, kendine işaret eden canonical, karşılıklı `tr`, `en`, `x-default` hreflang bağlantıları. İngilizce paylaşım kapağı `/en/opengraph-image.png`.
- `tests/english.test.ts`, `tests/e2e/english.spec.ts`: Çeviri kapsamı, seçenek kimlikleri, tüm kategori/seviye seçimleri, günlük set eşitliği, dil değiştirme, sonuç/paylaşım/çalışma ve erişilebilirlik kontrolleri.

Yeni soru eklerken ilgili İngilizce dosyaya `[id, soru, [seçenek1, seçenek2, seçenek3, seçenek4], açıklama]` satırını ekleyin. Seçenekleri **Türkçe kaynak dizisiyle aynı sırada** yazın; motor oyun başlarken karıştırır. Özel isimler ve kimyasal semboller çeviride değişmeyebilir. Kaynak doğrulama tarihi çeviri tarihiyle değiştirilmez. İngilizce dil editörü incelemesi otomatik testlerin yerine geçmez.

Günlük setin kimlikleri ve seçenek sırası iki dilde aynıdır. Rekorlar, görülen soru geçmişi ve isteğe bağlı istatistikler diller arasında ortaktır; aynı sorunun çevirisi yeni bir soru olarak sayılmaz. İngilizce paylaşım metni `/en` adresine götürür. İspanyolca bu sürüme dahil değildir.

Yayınlamadan önce mevcut web kökünü **ve Nginx site yapılandırmasını** yedekleyin. `out/` aktarımının yanında `deploy/nginx-https.conf` içindeki `/en` konumlarını mevcut HTTPS sunucu bloğuna uygulayın: `/en.html` doğrudan sunulur, `/en/` canonical `/en` adresine yönlendirilir ve bulunamayan İngilizce yollar `/en/404.html` ile 404 döner. Diğer sitelerin yapılandırmasını değiştirmeyin; önce `nginx -t`, sonra reload. İngilizce sayfaları, 404 durum kodunu, sitemap ve oyun akışını canlıda ayrıca kontrol edin. Hosting/DNS değişikliği gerekmez.

İngilizce geliştirme öncesi kaynak yedeği: `.backups/before-english-20260928.zip`.

## Tema

- Üst alandaki ay/güneş düğmesi Türkçe ve İngilizce sayfalarda açık ve karanlık görünümü değiştirir.
- İlk açılışta işletim sisteminin renk tercihi izlenir. Elle seçilen tema `ynby-theme` anahtarıyla cihazda saklanır; depolama engelliyse mevcut sekmede çalışmaya devam eder.
- Tema sayfa yüklenirken uygulanır; rehberler, oyun, sonuç, çalışma turu, istatistikler ve 404 aynı renk değişkenlerini kullanır. Açık sekmeler arasında tercih eşitlenir.
- Renk çiftleri ve yüzeyler `src/app/globals.css` içinde tanımlıdır. Yeni bileşenlerde sabit açık arka plan yerine mevcut yüzey değişkenlerini kullanın.

## İsteğe Bağlı Üyelik

Supabase tabanlı kayıt/giriş, e-postayla kod doğrulama, şifre yenileme, takma ad ve hesaba ait kişisel rekor eşitlemesi hazırlanmıştır. Misafir oyun korunur. Türkçe hesap `/hesap`, İngilizce `/en/account`; gizlilik ve hesap silme sayfaları iki dilde mevcuttur. Hesap ana sayfadaki kullanıcı simgesiyle de açılır.

Yeni ve ayrı bir Supabase projesi, SQL migration, sunucu tarafındaki hesap silme fonksiyonu ve özel SMTP kurulumu gerekir. `.env.local` içinde yalnızca `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` kullanılır; yapılandırma yoksa oyun çalışır ve üyelik kapalı görünür. Gizli anahtarları site veya APK'ya koymayın.

Kurulum ve yayın öncesi kontrol listesi: [Üyelik kurulumu](docs/membership.md). `npm run test:membership` ayrı `membership-test-out/` çıktısında taklit API ile masaüstü/mobil/tablet testlerini çalıştırır; bu test çıktısını yayınlamayın. SQL ve kimlik ayrımı testleri mevcut `npm test` komutuna dahildir. Web kaynak yedeği `.backups/before-membership-20260929-012809.zip` içindedir; Android native kaynakları bu aşamada değiştirilmemiştir. Önceki test APK'sı üyeliği içermez; kurulum tamamlanınca yeniden üretilmelidir.

## Android Uygulaması

Android projesi `android/`, yerel çalışma ayarları `capacitor.config.ts` içindedir. Mevcut web sitesi Hetzner'de değişmeden kalır; Android üretimi ayrı `mobile-out/` çıktısını kullanır. Sorular, iki dil ve görseller APK'ya dahil edilir. Kaynak bağlantıları, e-posta ve dış paylaşım uygulamaları internet veya ilgili uygulamayı gerektirebilir.

- `npm run android:sync`: Android için statik içerik üretir ve yerel projeyi eşitler.
- `npm run android:apk`: Java 21 ve Android SDK ile debug APK, Java birim testleri ve Android lint raporu üretir. Çıktı: `artifacts/ynby-android-test.apk`.
- `npm run android:open`: Android Studio kuruluysa yerel projeyi açar.
- Windows'ta Türkçe proje yolu için yalnızca native girdiler geçici ASCII klasöre kopyalanır; kaynak proje taşınmaz. Geçici derleme yolu komut çıktısında görünür.
- Java için `JAVA_HOME`, SDK için `ANDROID_HOME` kullanılabilir. Bu bilgisayarda hazırlanan `.android-tools/jdk21` taşınabilir derleyicisi ve kullanıcı Android SDK'sı da desteklenir; araçlar Git'e eklenmez.

Test APK'sı Play Store yayını değildir. Mağaza için gerçek telefon testi, geliştirici hesabı, kalıcı imzalama/anahtar yedeği, mağaza görselleri, gizlilik politikası ve gerekli test süreci ayrıca tamamlanmalıdır. Ayrıntılar: [Android hazırlığı](docs/android.md). Android öncesi kaynak yedeği `.backups/before-android-20260928.zip` içindedir.

## Web Sürümünün Sınırlamaları

- Havuz 620 sorudur; seviye/kategori sayıları eşit değildir. Geçmişe göre tekrar ertelenir ancak havuz tükenince veya cihaz depolaması kapalıysa farklı turlarda tekrar gelebilir. Tek turda tekrar etmez; aynı konu farklı sorularda tekrar ele alınabilir.
- Zorluk etiketleri editoryal başlangıç sınıflandırmasıdır; kullanıcı araştırmasıyla kalibre edilmemiştir.
- Cevaplar ve skor hesaplama istemcidedir; rekabetçi/ödüllü kullanım için hile koruması amaçlanmamıştır.
- Otomatik erişilebilirlik testi, ekran okuyucuyla manuel kullanıcı testinin yerini tutmaz.
- Native paylaşım penceresi ve Safari davranışları gerçek cihazda ayrıca denenmelidir.
# 29 Eylül 2026 Üyelik Yayını

Üyelik, Google giriş düğmesi ve güncel Türkçe/İngilizce gizlilik sayfaları canlı web sitesine aktarıldı. Google test modu korunuyor; marka doğrulaması ve hukuki değerlendirme henüz tamamlanmadı. Önceki site yedeği, paket özeti ve kontroller: [Yayın kaydı](docs/deployment-membership-20260929.md). Mevcut Android APK bu yayının parçası değildir.

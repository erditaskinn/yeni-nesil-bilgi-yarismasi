# Yeni Nesil Bilgi Yarışması

Türkçe, tek kişilik, üyeliksiz bilgi yarışması. Dört zorluk seviyesinde kaynakları belirtilmiş toplam 500 soru içerir (seviye başına 125). Oyuncu önce Karışık Sorular veya dört konu kategorisinden birini, ardından zorluğu seçer. Her turda seçilen kategori ve seviyeden 10 benzersiz soru gelir. Cevap sonrasında doğru seçenek ve kısa açıklama gösterilir; sonuç paylaşılabilir ve kategori/seviye bazında en yüksek puan cihazda tutulur.

Next.js App Router 16, React 19, katı TypeScript ve Tailwind CSS 4 kullanır. Tamamen statik olarak dışa aktarılır; uygulama sunucusu, veritabanı, hesap veya gizli anahtar gerektirmez. Analiz, reklam ve çerez eklenmemiştir.

Arama motorları için ana sayfaya ek olarak dört statik seviye rehberi ve dört kategori sayfası bulunur. Bu sayfalar oyundan örnek soruları, kısa açıklamalarını ve kaynak bağlantılarını gösterir. Her sayfanın kendine özgü başlığı, açıklaması ve canonical adresi vardır. Sitemap dokuz sayfayı listeler; WebSite ve BreadcrumbList yapılandırılmış verileri gerçek sayfa içeriğiyle uyumludur. Bu teknik hazırlık sıralama garantisi değildir.

**Yayın durumu:** 28 Eylül 2026'da (Türkiye saati) günlük 10 soru, dört kategori rehberi, dört mevcut soruya bağlı üç görsel ve isteğe bağlı cihaz istatistikleri Hetzner'e yayımlandı. Mevcut 500 soru, karışık/kategorili oyun, yakın tekrarları azaltma ve yanlışları çalışma korundu. Lint, tip kontrolü, 27 mantık testi, 35 farklı masaüstü/mobil/tablet tarayıcı senaryosu ve production build başarılı. Canlı domain üzerinde masaüstü ve mobil yeni akışlar, kategori sayfaları, görseller, sitemap, robots, 404 ve canonical yönlendirmeler ayrıca doğrulandı. Kaynak kodu [GitHub deposunda](https://github.com/erditaskinn/yeni-nesil-bilgi-yarismasi) sürümlenir. Sunucuya yayın ve GitHub kaynak yedeği ayrı işlemlerdir; biri diğerini otomatik güncellemez.

Bu yayın öncesi sunucu yedeği: `/var/www/yeninesilbilgiyarismasi-backup-before-daily-20260928-000242` (UTC). Yerel kaynak yedeği: `.backups/before-daily-discovery-20260928.zip`. Yeni dağıtım arşivi: `.backups/ynby-daily-discovery-20260928.tgz`; SHA-256: `dca5a46cbe3d292bcc9400625db13eb49363f8b01a28d2aab12a253a0d3277ce`. Önceki yedekler ve eski `_next/` paketleri korunmuştur. Nginx kontrolünde başka siteye (`kangarogo`) ait mevcut IPv6 protokol uyarısı görülür; sözdizimi kontrolü başarılıdır ve bu görevde o yapılandırma değiştirilmemiştir.

Yayın öncesi sunucu yedeği: `/var/www/yeninesilbilgiyarismasi-backup-before-learning-20260927-231723` (sunucunun UTC zaman damgası). Yerel kaynak yedeği: `.backups/before-learning-2026-09-28.zip`. Dağıtım arşivi: `.backups/ynby-learning-20260928.tgz`; SHA-256: `11edc248d83cffb77ffe64d71d2fcd1022bbe83bc0c4f0a41e01c52c1160a223`. Önceki kategori yedeği ve 27 Eylül sunucu yedeği korunmuştur. Açık eski tarayıcı sekmelerinin paketlerini bulabilmesi için önceki `_next/` dosyaları yayında şimdilik tutulur; disk kullanımı gelecekte kontrollü temizlenmelidir.

## Oyun akışı ve kategoriler

`Hemen Oyna` sonrası ilk seçenek olan **Karışık Sorular**, önceki gibi tüm konulardan soru seçer. Diğer seçenekler **Uzay**, **Bilim ve Doğa**, **Tarih ve Coğrafya** ve **Sanat ve Kültür** kategorileridir. Ardından Kolay, Orta, Zor veya Çok Zor seçilir. Her kategori/seviye birleşiminde en az 10 soru bulunur. Veri dosyasındaki ayrıntılı konu etiketlerinin bu dört gruba eşlenmesi `src/lib/categories.ts` içindedir. Yeni konu etiketi eklenirse bu eşlemeyi ve testleri de güncelleyin.

Karışık modun mevcut cihaz rekorları aynı `ynby:high-scores:v1` anahtarında kalır. Kategorili oyunların rekorları aynı anahtarın kategori uzantısında ayrı tutulur; hesap ve kişisel veri kullanılmaz. Seviye rehberlerinin doğrudan oynama bağlantıları karışık modda başlamaya devam eder.

## Tekrar azaltma ve öğrenme

Soru seçiminde cihazda kayıtlı geçmiş dikkate alınır. Önce görülmemiş sorular rastgele seçilir; yetmezse en eski görülen sorularla 10'a tamamlanır. Kategori ve zorluk filtreleri hiçbir zaman aşılmaz. Başarıyla başlatılan turun 10 soru kimliği `ynby:seen-questions:v1` anahtarına en eskiden en yeniye yazılır; liste en fazla 500 kimliktir. Yarım bırakılan turun seçilmiş soruları da geçmişe girer. Depolama reddedilir veya bozulursa oyun normal rastgele seçimle devam eder. Cihazlar arasında eşitleme ve kişisel veri kaydı yoktur.

Sonuçta yanlış ve süre dolan cevaplar **Yanlışlarımı İncele** ile doğru yanıt, oyuncunun cevabı, açıklama ve kaynaklarıyla açılır. **Yanlışlarımı Çalış** yalnızca bu turun kaçırılan sorularından oluşur: süre ve puan yoktur; her soruya bir kez cevap verilir, açıklamadan sonra ilerlenir. Tamamlandığında tekrar çalışılabilir veya değişmemiş yarışma sonucuna dönülebilir. Bu çalışma turu rekorlara yazılmaz ve sonucun paylaşım metnini değiştirmez. Tümü doğruysa yanlışları çalışma düğmeleri gösterilmez. Sayfa yenilenince çalışma ve son tur temizlenir; yerel rekorlar ve görülmüş soru geçmişi kalır.

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

Her seviyede 125 soru bulunur: Uzay, Bilim ve Doğa, Tarih ve Coğrafya havuzlarında 31'er; Sanat ve Kültür havuzunda 32 soru. Sayıyı değiştirecekseniz test beklentisini de bilinçli olarak güncelleyin. `npm test` toplam ve seviye başına sayıyı, soru kimliklerini ve metinlerini, seçenek benzersizliğini, tek doğru yanıtı ve kaynak/tarih alanlarını kontrol eder. Bu kontroller içerik editörünün bilgi doğrulamasının yerine geçmez.

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
- Günlük v1 havuzu mevcut `e01..e125`, `m01..m125`, `h01..h125`, `x01..x125` kimliklerine sabittir; sonraki havuz eklemeleri günlük seti değiştirmez. Bu kimlikleri silmek veya metinlerini değiştirmek günlük setin bütünlüğünü etkiler. Yeni bir günlük havuz sürümüne geçişi gün değişimine göre planlayın. Tarih cihaz saatine dayanır; sunucu saati doğrulaması veya günlük rekabet sıralaması yoktur.
- **Kategori sayfaları:** `/uzay-bilgi-yarismasi`, `/bilim-ve-doga-bilgi-yarismasi`, `/tarih-ve-cografya-bilgi-yarismasi`, `/sanat-ve-kultur-bilgi-yarismasi`. Özgün açıklamalar, dört seviyeden kaynaklı örnekler ve ilgili kategoriye doğrudan oyun bağlantıları içerir. Metadata/canonical ve breadcrumb verileri `src/lib/category-pages.ts` / `src/components/category-guide.tsx` üzerinden hazırlanır. Sitemap ana sayfa, dört seviye ve dört kategori olmak üzere 9 URL içerir. Sorgu parametreleri ayrı sitemap sayfaları değildir.
- **Search Console:** Mevcut sitemap adresini yeniden okutun; dört yeni URL'yi URL Denetimi ile test edip dizine eklenmesini isteyin. Performans > Arama sonuçları ekranında sayfa filtresiyle her kategori URL'sini seçin; Sorgular bölümünde gösterim, tıklama, TO ve ortalama konumu 28 günlük dönemlerle karşılaştırın. Search Console hesabına erişim olmadan rapor takibi yapılamaz. İndekslenme veya sıralama garantisi yoktur; anahtar kelime doldurma, sahte puanlama ve kopya sayfalar eklenmez.
- **İstatistiklerim:** Ana sayfadaki düğmeyle açılır, varsayılan kapalıdır. Kullanıcı açarsa yalnızca yeni tamamlanan son 100 tur `ynby:statistics:v1` ile cihazda saklanır. Tur kimliği çift kayıtları önler; günlük tur ayrı kategori olarak gösterilir. Yanlışları çalışma turları kaydedilmez. Kapatma kayıtları siler; açıkken Kayıtları Sil sıfırlar. Depolama engelli olduğunda kayıt yapılamadığı bildirilir, oyun etkilenmez. Hesap, çerez, dış analiz veya cihazlar arası eşitleme yoktur.
- Yeni mantık testleri `tests/daily-statistics.test.ts`, uçtan uca testler `tests/e2e/new-modes.spec.ts` içindedir. Masaüstü, telefon ve tablet boyutlarında günlük turun tamamlanması, paylaşım, tekrar, istatistik onayı/silme, kategori bağlantıları, canonical, kaynaklar, görsel yüklenmesi, taşma ve otomatik erişilebilirlik denetlenir.

## Diğer sınırlamalar

- Havuz seviye başına 125 sorudur; geçmişe göre tekrar ertelenir ancak havuz tükenince veya cihaz depolaması kapalıysa farklı turlarda tekrar gelebilir. Tek turda tekrar etmez.
- Zorluk etiketleri editoryal başlangıç sınıflandırmasıdır; kullanıcı araştırmasıyla kalibre edilmemiştir.
- Cevaplar ve skor hesaplama istemcidedir; rekabetçi/ödüllü kullanım için hile koruması amaçlanmamıştır.
- Otomatik erişilebilirlik testi, ekran okuyucuyla manuel kullanıcı testinin yerini tutmaz.
- Native paylaşım penceresi ve Safari davranışları gerçek cihazda ayrıca denenmelidir.

# Soru Zorluk İncelemesi

## 22 Kasım 2026 kategori ve seviye dengelemesi

Her kategori ve zorluk seviyesinde en az 35 soru hedefi tamamlandı. Mevcut 1.562 soruya 358 yeni Türkçe soru eklendi: 73 kolay, 38 zor, 247 çok zor. Orta seviyeye ekleme gerekmedi. Havuz artık 1.920 sorudur. Eski soruların zorlukları sayısal hedef için değiştirilmedi.

| Konu | Kolay | Orta | Zor | Çok zor | Toplam |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sanat ve kültür | 35 | 57 | 43 | 35 | 170 |
| Sinema ve televizyon | 35 | 44 | 74 | 35 | 188 |
| Genel kültür | 44 | 63 | 35 | 35 | 177 |
| Coğrafya | 35 | 71 | 35 | 35 | 176 |
| Tarih | 35 | 54 | 48 | 35 | 172 |
| Dil ve edebiyat | 35 | 60 | 49 | 35 | 179 |
| Bilim ve doğa | 35 | 72 | 37 | 35 | 179 |
| Uzay | 35 | 55 | 49 | 35 | 174 |
| Spor | 35 | 66 | 35 | 35 | 171 |
| Teknoloji | 35 | 59 | 49 | 35 | 178 |
| Türkiye | 35 | 48 | 35 | 38 | 156 |
| **Toplam** | **394** | **649** | **489** | **388** | **1.920** |

Yeni içerik kategori başına ayrı `src/data/questions-tr-level-*.ts` dosyalarında tutulur. `level-balance-format.ts` kimlik, seçenek, kaynak ve inceleme tarihini ortak biçime dönüştürür. 358 kaydın her birinde açıklama, HTTPS kaynak adresi ve inceleme tarihi bulunur; yeni grupta 80 farklı kaynak URL'si kullanıldı. Kaynaklar arasında RFC Editor/IETF, NASA, UNESCO, National Gallery, Philharmonia, Academy of Motion Picture Arts and Sciences, Harvard, Academy of American Poets, BIPM, RSC, spor federasyonları ve Türkiye'nin resmî kurumları vardır.

Denetim: 1.920 benzersiz kimlik; yeni kayıtlarda dört farklı seçenek ve geçerli doğru yanıt; bütün 44 kategori/seviye hücresinde en az 35 soru. Metin ve aynı yanıt benzerliği taramasında yeni eklemeler mevcut havuzla karşılaştırıldı; El Caracol ve Namib sis bilgisiyle çakışan iki taslak değiştirildi. Bu tarama, eski havuzdaki tüm anlamsal tekrarların temizlendiği anlamına gelmez. Zorluklar editoryal ölçütlere dayanır; oyuncu başarı oranlarıyla kalibrasyon yapılmış değildir.

`npx tsc --noEmit --incremental false` geçti. Kullanıcının isteği doğrultusunda test paketi çalıştırılmadı. Bu aşamada Türkçe soru verisi ve bu not güncellendi; İngilizce sürüm, oyun davranışı, APK'ya özel çok oyunculu kodu ve canlı yayın değiştirilmedi. Önceki tarihli dağılımlar aşağıda tarihsel kayıt olarak korunur.

## 10 Kasım 2026 kategori dengelemesi

Kategori başına yaklaşık 140 soru hedefi tamamlandı: 355 Türkçe soru eklendi. 1.562 soruluk havuzun güncel dağılımı aşağıdadır. Her kategoride en az 140 soru vardır; bilim ve doğa 156, uzay 146 soruda kaldı. Kaynaklar her yeni sorunun `sourceUrl` alanındadır.

| Konu | Kolay | Orta | Zor | Çok zor | Toplam |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sanat ve kültür | 25 | 57 | 43 | 15 | 140 |
| Sinema ve televizyon | 19 | 44 | 74 | 3 | 140 |
| Genel kültür | 44 | 63 | 26 | 7 | 140 |
| Coğrafya | 34 | 71 | 20 | 15 | 140 |
| Tarih | 29 | 54 | 48 | 9 | 140 |
| Dil ve edebiyat | 29 | 60 | 49 | 2 | 140 |
| Bilim ve doğa | 32 | 72 | 37 | 15 | 156 |
| Uzay | 29 | 55 | 49 | 13 | 146 |
| Spor | 26 | 66 | 29 | 19 | 140 |
| Teknoloji | 27 | 59 | 49 | 5 | 140 |
| Türkiye | 27 | 48 | 27 | 38 | 140 |
| **Toplam** | **321** | **649** | **451** | **141** | **1.562** |

İlk 50 soru yedi düşük toplamlı kategoriye dağıtıldı: sinema 8, genel kültür 7, coğrafya 7, tarih 4, dil ve edebiyat 8, spor 8, teknoloji 8. Ardından sanat ve kültüre 30, Türkiye'ye 13, sinema ve televizyona 39, genel kültüre 38, coğrafyaya 37, tarihe 34, dil ve edebiyata 39, spora 38, teknolojiye 37 soru eklendi. Dokuz kategori 140'a ulaştı; bilim ve doğa ile uzay zaten bu eşiğin üzerindeydi. Bu turda İngilizce içerik, APK ve canlı yayın değiştirilmedi.

## 9 Kasım 2026 Türkçe takip incelemesi

Önceki 580 soruluk editoryal incelemeden sonra eklenen 627 Türkçe soru da tamamıyla gözden geçirildi. Önceki 121 soruda 103, kalan 506 soruda 208 sınıflandırma düzeltmesi yapıldı; 627 eklemenin toplam 311 zorluk değişikliği açık kimliklerle `src/data/turkish-difficulty-review.ts` içinde tutulur. Bu bir oyuncu başarı oranı kalibrasyonu değildir.

Takip ölçütü: Kolay günlük/temel okul bilgisi; Orta yaygın genel kültür veya tanınabilir bir yer/eser; Zor uzmanlık, daha az bilinen kişi/ilişki, teknik kavram ya da tarihli ödül bilgisi; Çok zor resmî katalog sayıları, kesin ölçüler ve ileri düzey teknik/kural ayrıntısı. Soru uzunluğu ve seçeneklerin kolay görünmesi zorluk ölçütü sayılmaz.

Güncel Türkçe dağılımı:

| Konu | Kolay | Orta | Zor | Çok zor | Toplam |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sanat ve kültür | 23 | 43 | 31 | 13 | 110 |
| Sinema ve televizyon | 12 | 15 | 63 | 3 | 93 |
| Genel kültür | 33 | 33 | 23 | 6 | 95 |
| Coğrafya | 24 | 47 | 11 | 14 | 96 |
| Tarih | 21 | 35 | 38 | 8 | 102 |
| Dil ve edebiyat | 16 | 38 | 37 | 2 | 93 |
| Bilim ve doğa | 32 | 72 | 37 | 15 | 156 |
| Uzay | 29 | 55 | 49 | 13 | 146 |
| Spor | 17 | 38 | 21 | 18 | 94 |
| Teknoloji | 15 | 35 | 42 | 3 | 95 |
| Türkiye | 23 | 41 | 25 | 38 | 127 |
| **Toplam** | **245** | **452** | **377** | **133** | **1.207** |

Örnekler: Okavango'nun Botsvana'da bulunması orta; 2020/2014/2019 Nobel Edebiyat kazananlarını bulma zor; Uluslararası Astronomi Birliğinin resmî takımyıldız sayısını hatırlama çok zor olarak sınıflandırıldı. Teknoloji tarihindeki belirli cihaz, kurum ve yıl soruları ile tarihli Oscar arşiv soruları da kolaydan orta/zora taşındı. Değişiklik kimlikleri ve seviyeleri `src/data/turkish-difficulty-review.ts` içinde tutulur. Bu takip incelemesi yalnızca Türkçe havuzun dışa aktarılan soru dizisine uygulanır; İngilizce içerik ve sabit kimlikli günlük tur seti değişmez.

Güncel sayıların dengeli görünmesi hedef değil; her kategori/seviyede soru sayısı farklı olabilir. 627 yeni kaydın tamamı editoryal olarak gözden geçirildi; 311 kaydın zorluk seviyesi düzeltildi. Gerçek oyuncu başarı verisiyle kalibrasyon, veri biriktikçe ayrıca yapılabilir.

Takip incelemesi tarihi: 9 Kasım 2026. Bu çalışma oyuncu başarı oranlarından çıkarılmış bir kalibrasyon değildir; metin, seçenekler ve gereken bilgi üzerinden editoryal yeniden sınıflandırmadır. Yaş bilgisi, dış analiz veya otomatik zorluk değiştirme eklenmedi.

## Ölçütler

- Kolay: günlük hayattan ve temel okul bilgisinden tanıdık konular; uzmanlık terimi, katalog bilgisi veya özel tarih ezberi istemez.
- Orta: yaygın genel kültür, bilinen eser/yer, temel bilimsel ilişkiler ve oyun kuralları.
- Zor: belirli bir alanda bilgi, daha az bilinen tarihsel ilişki veya teknik kavram.
- Çok zor: kesin ölçüler, tarih/katalog ayrıntıları ve ileri düzey kurallar.

Bir sorunun kısa olması veya seçenekler arasında bariz yanlışlar olması, özel uzmanlık isteyen cevabını kolay yapmaz. Aynı zamanda temel bir kural çok zor seviyeyi doldurmak için kullanılmamalıdır. Zorluk kişiye ve kültürel aşinalığa bağlıdır; gerçek oyuncularla ileride yapılacak araştırma bu editoryal kararları iyileştirebilir.

## Güncel Dağılım

| Kategori | Kolay | Orta | Zor | Çok zor | Toplam |
| --- | ---: | ---: | ---: | ---: | ---: |
| Uzay | 29 | 55 | 48 | 12 | 144 |
| Bilim ve Doğa | 22 | 72 | 35 | 15 | 144 |
| Tarih ve Coğrafya | 21 | 57 | 28 | 38 | 144 |
| Sanat ve Kültür | 32 | 64 | 34 | 18 | 148 |
| Toplam | 104 | 248 | 145 | 83 | 580 |

Mevcut 500 kayıt zorluk açısından gözden geçirildi; 301 kaydın seviyesi değişti. 80 yeni soru eklendi: her kategoriye 20; 40 kolay, 37 orta, 3 zor. Sayıları eşitlemek için sorular yanlış seviyelere yerleştirilmedi. Her kategori/seviyede en az 10, kolay kategorilerde en az 20 soru bulunması testlerle korunur.

Örnek kararlar:

- `e70`: Titan göllerinin kimyası, kolaydan zora.
- `e76`: Venüs bulutlarındaki sülfürik asit, kolaydan zora.
- `e35`: Nemrut'un Kommagene ile ilişkisi, kolaydan zora.
- `e113`: Yıldızlı Gece'nin koleksiyon müzesi, kolaydan zora.
- `m77`: Suyun molekül formülü, ortadan kolaya.
- `h45`: Satrançta atın taşların üzerinden atlaması, zordan kolaya.
- `x119`: Satrançta iki şahın bitişik olamaması, çok zordan kolaya.
- `r032`: Kohezyon, yeni fakat teknik olduğu için zor; kolay havuza konmadı.

Eski kayıtların kimlikleri ve seçenek kimlikleri korunur. İngilizce sürüm aynı zorlukları devralır. Eski çeviri dosyalarının isimleri veya soru kimliklerinin ön ekleri seviye seçimi için kullanılmaz. Görseller, yerel rekorlar ve görülmüş soru geçmişinin biçimi değişmez. Eski skorlar otomatik silinmez; sınıflandırma değiştiği için önceki sürümle birebir karşılaştırılabilir sayılmaz.

## Yeni Kaynaklar ve İçerik

Yeni metinler kaynaklardan uzun alıntılar veya başka bir yarışmanın soruları kopyalanarak hazırlanmadı. Her kayıt kendi kaynak bağlantısını ve inceleme tarihini taşır.

- [NASA Space Place](https://spaceplace.nasa.gov/): tutulmalar, galaksiler, Ay evreleri, mevsimler ve gök cisimleri. [Apollo 11](https://www.nasa.gov/mission/apollo-11/) ve [Hubble](https://science.nasa.gov/mission/hubble/) için NASA görev kayıtları.
- [USGS su döngüsü](https://water.usgs.gov/edu/watercycle-kids-int.html): buharlaşma, yoğuşma, yağış, sızma. Yoğunluk, pH ve kohezyon için ilgili Water Science School sayfaları; magma/lav için USGS açıklaması.
- [NOAA mavi balina](https://www.fisheries.noaa.gov/species/blue-whale): memeliler, solunum ve kril; NOAA kelp, mangrov ve fok sayfalarıyla doğa çeşitliliği.
- [Royal Society of Chemistry](https://periodic-table.rsc.org/): cıva, grafit, demir/çelik ve elementlerin bolluğu. Teknik kavramlar kolay havuza konmadı; yeni helyum kaydı eski soy gaz sorusunu tekrarlamak yerine evrendeki bolluğunu sorar.
- [UNESCO](https://whc.unesco.org/en/list/): Çin Seddi, Tac Mahal, Machu Picchu, Özgürlük Heykeli, Roma, Atina, Venedik, Stonehenge, Petra, Angkor ve diğer anıtlar. Ülke/şehir tanıma soruları ile uygarlık ayrıntıları ayrı seviyelerde.
- [Philharmonia çalgı rehberleri](https://philharmonia.co.uk/resources/instruments/violin/): keman, flüt, trompet ve timpani.
- [National Gallery sözlüğü](https://www.nationalgallery.org.uk/paintings/glossary/perspective): perspektif, natürmort, fresk ve triptik.
- [IFAB](https://www.theifab.com/laws/latest/the-players/) ve [FIBA 2024 resmî kuralları](https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2024-v10a.pdf): futbol/basketbol. FIBA/NBA veya standart futbol/küçük saha kuralları belirsiz bırakılmadı. Kural kaynaklarını sonraki içerik incelemelerinde yeniden kontrol edin.

Bu zorluk incelemesi, eski 500 kaydın bütün kaynaklarının yeniden doğrulandığı anlamına gelmez. Aynı konuya değinen eski sorular hâlâ vardır; otomatik benzersizlik denetimi anlamsal tekrarları bütünüyle tespit etmez.

## Bakım ve Doğrulama

Yeni kayıtlar `src/data/questions-foundations.ts`, İngilizce eşleri `src/data/en/foundations.ts` içindedir. Mevcut kayıtların seviye düzeltmeleri `src/data/difficulty-review.ts` içinde açık kimliklerle tutulur; bilinmeyen veya çift düzeltme kimliği hata verir. Kaynak inceleme tarihi seviye düzenlemesinin tarihinden ayrıdır.

Yeni soru eklerken yanıtı, açıklamayı, dört seçenekten yalnızca birinin doğru olmasını, kategori eşlemesini ve iki dildeki seçenek sırasını denetleyin. Özel isim/teknik terim/tarih içeren kayıtları kolay seviyeye eklemeyin. Rehber örneklerinin seviyeye uygunluğunu ve günlük tur sürümünü kontrol edin.

Günlük v1 seti 28 Eylül 2026 ve öncesinde eski kimlik gruplarıyla korunur. 29 Eylül'den itibaren v2, sabit 580 kimliğin güncel seviyeleriyle seçilir. Aynı günün soru ve seçenek sıralarının değişmemesi için sonraki incelemelerde sürüm geçişini de planlayın.

Kaynak yedeği: `.backups/before-difficulty-review-20260928.zip`. Bu dosya GitHub veya sunucu yedeği yerine geçmez. Bu incelemenin canlıya yayını ayrı bir işlemdir; eski yayın notları yeni havuzun yayımlandığının kanıtı değildir.

## Canlı Yayın Kaydı

28 Eylül 2026'da kullanıcı onayıyla 580 soruluk sürüm `https://yeninesilbilgiyarismasi.com` ve `/en` üzerinde yayımlandı. Sunucu: `prod-web-01`, web kökü: `/var/www/yeninesilbilgiyarismasi`.

- Önceki site ve Nginx yapılandırması: `/var/backups/ynby/difficulty-580-20260928-200004/site` ve aynı dizinde `nginx.conf` (sunucu saati UTC).
- Paket: `.backups/difficulty-review-580-20260928.tar.gz`.
- SHA-256: `74813e1b01edbc3683b6158d7505a183c65f0b3a2c2e700c4dcd7590aff599c4`.
- Aktarımda önce statik paketler, ardından kalan dosyalar kopyalandı. `--delete` kullanılmadı; eski açık sekmelerin ihtiyaç duyabileceği paketler korundu. Nginx, DNS ve e-posta ayarları değiştirilmedi.
- Staging/yayın checksum karşılaştırması boş fark verdi. Sitemap'teki 18 sayfa ve marka/paylaşım görselleri 200; bulunmayan Türkçe/İngilizce yollar 404; HTTP ve www canonical yönlendirmeleri 301 döndü.
- Canlıda `difficulty-review.spec.ts --grep science` altı senaryosu geçti: iki dil, masaüstü/telefon/tablet; tam kolay tur, dört seviye filtresi, yeni helyum sorusu, geri bildirim, sonuç, konsol, taşma ve erişilebilirlik.
- Yerel yayın öncesi kontroller: lint, TypeScript, 38 birim testi ve production build başarılı. Tam 92 tarayıcı senaryosu başarılıydı; son içerik düzeltmesinden sonra ilgili altı senaryo yeniden doğrulandı.

GitHub'a commit/push bu yayın işleminin parçası değildir. Geri dönüş gerekirse yukarıdaki yedek kullanılmalı; mevcut yayını ve açık sekmeleri dikkate alarak dosyalar karşılaştırılmalıdır.

Kontroller: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e -- tests/e2e/difficulty-review.spec.ts`. Yeni tarayıcı senaryoları tüm yeni kolay soruları iki dilde oynatır; dört kategori ve dört seviyenin filtrelerini, geri bildirimi, sonuçları, konsolu, taşmayı ve otomatik erişilebilirliği masaüstü/telefon/tablet boyutlarında denetler.

# Tempo ve kategori revizesi (30 Eylul 2026)

## Kullanici akisi ve puanlama

Kategori -> seviye -> tur uzunlugu ve tempo -> Yarismaya Basla. Baslat dugmesi iki secim de yapilana kadar kapali. Gunluk 10 Soru bu ekrani atlar ve her zaman 20 saniyelik Yarisma Modunda calisir. Sonsuz ve Yanlislarim turlari iki tempoyu da destekler. Yarisma Modunda dogru cevap `100 + kalan saniye * 5`, yanlis veya sure asimi `0` puandir. Rahat Modda sure/sayac/zaman asimi yoktur; dogru cevap `100`, yanlis `0` puandir. Sonucta tempo etiketi vardir; yerel rekor anahtarlari ve istatistikler tempoya gore ayrilir.

## Merkezi kategoriler ve banka

Tek kaynak `src/lib/categories.ts`; Turkce/Ingilizce ad/aciklama, kimlik, ikon adi, renk ve slug burada tanimlidir. Soru sayisi ve kullanilabilirlik kanonik soru bankasindan hesaplanir; SEO basligi/aciklamasi bu merkezi ad/aciklamadan uretilir. `src/data/questions.ts` mevcut kimlik/icerik/kaynaklari degistirmeden eski konu etiketlerini kanonik kategoriye esler. Ingilizce havuz ayni kimlikleri kullandigindan esleme iki dilde aynidir. Karisik tur, secilen seviyedeki aktif kategorilerden tekrar etmeden donusumlu secim yapar. Toplam 580 ozgun soru vardir; Karisik satiri bu sorulari tekrar sayar.

| Kategori | Kolay | Orta | Zor | Cok zor | Toplam |
| --- | ---: | ---: | ---: | ---: | ---: |
| Karisik Sorular | 104 | 248 | 145 | 83 | 580 |
| Uzay | 29 | 55 | 48 | 12 | 144 |
| Bilim ve Doga | 22 | 72 | 35 | 15 | 144 |
| Tarih | 4 | 10 | 5 | 1 | 20 |
| Cografya | 10 | 11 | 4 | 0 | 25 |
| Sanat ve Kultur | 7 | 34 | 22 | 12 | 75 |
| Spor | 4 | 6 | 0 | 0 | 10 |
| Teknoloji | 0 | 0 | 0 | 0 | 0 |
| Sinema ve Televizyon | 0 | 0 | 0 | 0 | 0 |
| Dil ve Edebiyat | 0 | 12 | 2 | 1 | 15 |
| Turkiye | 7 | 37 | 20 | 38 | 102 |
| Genel Kultur | 21 | 11 | 9 | 4 | 45 |

5/10/20 soruluk turun yeterlilik kontrolu bu sayilardan dogrudan yapilir: `0` olan seviyeler secilemez; `1-4`, `5-9` veya `10-19` sorusu bulunanlarda ilgili uzunluk mevcut havuza indirilir ve secim ekraninda gercek sayi bildirilir. Ayni turda soru tekrarlanmaz ve baska kategoriden gizlice tamamlama yapilmaz. Teknoloji ve Sinema/Televizyon kartlari tum cihazlarda `Yakinda` olarak gorunur, pasiftir. Kaynaksiz soru eklenmedi.

Asagidaki her `5/10/20` hucresinde `E` yeterli, `H` yetersiz anlamindadir. Yetersizse uygulama daha kisa mevcut havuzu acikca bildirir; `0` soruda seviye secilemez.

| Kategori | Seviye | Soru | 5/10/20 |
| --- | --- | ---: | --- |
| Karisik | Kolay | 104 | E/E/E |
| Karisik | Orta | 248 | E/E/E |
| Karisik | Zor | 145 | E/E/E |
| Karisik | Cok zor | 83 | E/E/E |
| Uzay | Kolay | 29 | E/E/E |
| Uzay | Orta | 55 | E/E/E |
| Uzay | Zor | 48 | E/E/E |
| Uzay | Cok zor | 12 | E/E/H |
| Bilim ve Doga | Kolay | 22 | E/E/E |
| Bilim ve Doga | Orta | 72 | E/E/E |
| Bilim ve Doga | Zor | 35 | E/E/E |
| Bilim ve Doga | Cok zor | 15 | E/E/H |
| Tarih | Kolay | 4 | H/H/H |
| Tarih | Orta | 10 | E/E/H |
| Tarih | Zor | 5 | E/H/H |
| Tarih | Cok zor | 1 | H/H/H |
| Cografya | Kolay | 10 | E/E/H |
| Cografya | Orta | 11 | E/E/H |
| Cografya | Zor | 4 | H/H/H |
| Cografya | Cok zor | 0 | H/H/H |
| Sanat ve Kultur | Kolay | 7 | E/H/H |
| Sanat ve Kultur | Orta | 34 | E/E/E |
| Sanat ve Kultur | Zor | 22 | E/E/E |
| Sanat ve Kultur | Cok zor | 12 | E/E/H |
| Spor | Kolay | 4 | H/H/H |
| Spor | Orta | 6 | E/H/H |
| Spor | Zor | 0 | H/H/H |
| Spor | Cok zor | 0 | H/H/H |
| Teknoloji | Kolay | 0 | H/H/H |
| Teknoloji | Orta | 0 | H/H/H |
| Teknoloji | Zor | 0 | H/H/H |
| Teknoloji | Cok zor | 0 | H/H/H |
| Sinema ve Televizyon | Kolay | 0 | H/H/H |
| Sinema ve Televizyon | Orta | 0 | H/H/H |
| Sinema ve Televizyon | Zor | 0 | H/H/H |
| Sinema ve Televizyon | Cok zor | 0 | H/H/H |
| Dil ve Edebiyat | Kolay | 0 | H/H/H |
| Dil ve Edebiyat | Orta | 12 | E/E/H |
| Dil ve Edebiyat | Zor | 2 | H/H/H |
| Dil ve Edebiyat | Cok zor | 1 | H/H/H |
| Turkiye | Kolay | 7 | E/H/H |
| Turkiye | Orta | 37 | E/E/E |
| Turkiye | Zor | 20 | E/E/E |
| Turkiye | Cok zor | 38 | E/E/E |
| Genel Kultur | Kolay | 21 | E/E/E |
| Genel Kultur | Orta | 11 | E/E/H |
| Genel Kultur | Zor | 9 | E/H/H |
| Genel Kultur | Cok zor | 4 | H/H/H |

## Veri uyumlulugu

- Eski tempo bilgisi olmayan oyunlar `competition` kabul edilir; yeni aktif oturum tempo, kategori, seviye, tur, soru sirasi, cevaplar, puan ve sureyi kanonik soru bankasindan geri yukler.
- Eski yerel `history` skor anahtari ve eski sunucu `history` degeri `Tarih ve Cografya - Eski Turlar` olarak korunur. Yeni Tarih skorunun anahtari yerelde `history:v2`, sunucuda `history_v2` olur. Eski toplam yapay olarak Tarih/Cografya arasinda bolunmez.
- Eski `science` ve `culture` kayitlari eski tur etiketiyle korunur; yeni `science_nature` ve `arts_culture` ayri yazilir. Eski oyun/spor toplamini soru bazinda ayrisamiyorsa silinmez.
- `supabase/migrations/202609300001_categories.sql` yalnizca kategori CHECK ve rekor RPC izin listesini genisletir; mevcut satirlari silmez. Canli yayindan once SQL Editor'da calistirilmalidir.
- Yerel istatistik ve yanlis cevap kayitlari istege bagli olmaya devam eder. Hesaba esitleme mevcut kapsaminda yalnizca tam standart Yarisma Modu rekorlari icindir; Rahat Mod ve diger turlar bu cihazda tutulur.

## Web / SEO / Android

- On iki kategori tek dikey akista bulunur; 3/2/1 sutunluk esnek duzen kullanilir. Bos kartlar secilemez. Seviye bazinda sifir havuz da secilemez.
- Dokuz dolu kategori icin TR/EN aciklama sayfasi, benzersiz canonical, karsilikli hreflang, Open Graph ve breadcrumb yapilandirilmis verisi uretilir. Eski `tarih-ve-cografya-bilgi-yarismasi` ve `history-and-geography-trivia-quiz` adresleri birlesik aciklama sayfasi olarak korunur. Sitemap aktif kategori sayfalarini icerir.
- Android Capacitor paketi ayni React/kategori/soru kaynagini yerel `mobile-out` web dosyalarina gomup olusturur; uzaktan WebView acmaz. Paket kimligi ve imza yapilandirmasi degismedi. Yeni surum kodu 5, surum adi 0.4.0. Test APK'si Play Store yayini icin imzali bir release degildir.

## Degisen dosyalar

`src/lib/categories.ts`, `src/data/questions.ts`, `src/lib/game.ts`, `src/lib/pace.ts`, `src/lib/round-session.ts`, `src/lib/storage.ts`, `src/lib/statistics.ts`, `src/lib/membership.ts`, `src/lib/locale.ts`, `src/lib/sharing.ts`, `src/lib/category-pages.ts`, `src/lib/english-pages.ts`, `src/components/category-selection.tsx`, `src/components/level-selection.tsx`, `src/components/round-selection.tsx`, `src/components/quiz-app.tsx`, `src/components/quiz.tsx`, `src/components/results.tsx`, `src/components/statistics.tsx`, `src/components/category-guide.tsx`, `src/components/legacy-category-guide.tsx`, `src/components/account-provider.tsx`, `src/components/account-panel.tsx`, `src/components/exit-dialog.tsx`, `src/app/globals.css`, kategori sayfasi rotalari, `src/app/sitemap.ts`, `supabase/migrations/202609300001_categories.sql`, `android/app/build.gradle`, ilgili birim ve E2E testleri.

## Dogrulama ve yayin

- `npm run test`: 72/72 gecti (PostgreSQL/PGlite uyumluluk ve migration testi dahil). `npm run lint`, `npm run build` ve TypeScript derlemesi basarili. Yeni bagimlilik eklenmedi.
- Masaustu tam E2E taramasi: ilk turda 43/54, eski metin/kategori beklentileri ve bir test kurulum hatasi duzeltildikten sonra basarisiz 11 senaryo ile yeni dort senaryo tekrar kosulup gecti. Mobil/tablet odakli taramada 33/36 ilk gecis; dil degisimi yukleme beklemesi ve yavas cihazda timer testi duzeltildikten sonra kalan 4 hedefli tekrar testi gecti. Fiziksel Samsung A50 testi yapilmadi; cihaz ADB listesinde yoktu ve kullanici APK'yi kendisi kurmayi secti.
- Canli web yedegi: `/var/backups/ynby/pace-categories-prepublish-20260929-215611` (sunucu UTC saati). Site ve Nginx kopyasi vardir; Nginx degistirilmedi. Diger siteye ait eski IPv6 protokol uyarisi aynen kaldi.
- Web arsivi: `.backups/pace-categories-20260930-final.tar.gz`, SHA-256 `8bc31db603a33d0128ad764ccb2b83e527ee3123a180a4ee658b45291dc1cf42`. 231 dosya ayri hazirlik klasorunde acilip eski dosyalar silinmeden yayimlandi. Son `rsync -rcni` farki sifir. HTTPS `/`, `/en`, hesap/gizlilik sayfalari, yeni Tarih/Cografya, eski birlesik TR/EN URL'ler ve sitemap 200 dondu. Canli 390 px misafir tarayici testi: 12 kategori, Rahat Modda sayac yok, ilk soru acildi, yatay tasma yok.
- Android: `assembleDebug`, `testDebugUnitTest`, `lintDebug` basarili; son web esitlemesinden sonra `assembleDebug` yeniden basarili. APK `artifacts/ynby-android-test.apk`, 6.734.853 bayt, SHA-256 `ce94bedc7b4233c554beeb74f36d3e029363ee1ea0ec72df58a121731ea422d7`. Paket `com.yeninesilbilgiyarismasi.app`, surum 0.4.0/kod 5, min API 24, hedef API 36. 0.3.0 yedegi `artifacts/ynby-android-test-0.3.0-backup.apk`; iki APK'nin imza sertifikasi SHA-256 ozeti `69d46833a2f40d8b35351322e0debe0d312361ede9e484d68c66111328fc2414` olarak ayni. APK icindeki 231 web dosyasi `mobile-out` ile SHA-256 bazinda eslesti; iki ek Cordova kopru dosyasi beklenen Capacitor ciktisidir. Bu test APK'si Play Store release imzasi degildir.
- Uyelik E2E taramasinda masaustu/mobil/tablet toplam 21 senaryonun tamami `ok` sonucu verdi; test kosucusu kapanista takildigi icin temiz cikis kodu alinamadi ve durduruldu.
- Kullanici Supabase SQL'i calistirdigini bildirdi. PGlite migration testi yesil; canli veritabaninda oturum acmis bir hesapla yeni kategori rekorunun yazma/okuma testi bu calismada yapilamadi. Eski veriler silinmedi; SQL migration ekleyicidir.

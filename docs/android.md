# Android Hazırlığı

Amaç: mevcut tasarımı koruyarak önce telefona kurulabilen bir test sürümü. Google Play'e otomatik yayın, hesap açma, ücret ödeme veya release anahtarı oluşturma yapılmaz. Hetzner'deki web sitesi bu çalışmada değiştirilmez.

## Yapı

- Capacitor core/Android/CLI 8.5.2, App 8.1.1, Share 8.0.2; sürümler kilitli.
- `capacitor.config.ts`: paket adı `com.yeninesilbilgiyarismasi.app`, yerel `mobile-out` web içeriği. Uzak `server.url`, açık HTTP veya dış hostlara `allowNavigation` yok.
- `scripts/android.mjs`: ayrı Next.js çıktısı, Capacitor eşitlemesi, APK/test/lint derlemesi. Web için `npm run build` hâlâ `out/` üretir.
- `android/app`: Java kaynakları, izinler, mevcut marka işaretinden türetilmiş simge, açılış ekranı. Kamera, konum, rehber, bildirim, reklam ve analiz eklenmez. Android yedekleme kapalıdır; skorlar cihazda kalır.
- `OfflineRoutes`: standart SPA fallback'inin `/en` için Türkçe ana sayfayı açmasını önler. Yerel sayfalarda ayrı statik HTML dosyalarını, bulunamayan sayfalarda dilin 404 dosyasını sunar. Kaynaklar/dış siteler Capacitor'ın normal dış bağlantı davranışını kullanır.
- `NativeRuntime`, `useAndroidBack`: geri tuşu, oynanan turda çıkış onayı, sonuçtan ana sayfa, ana sayfada uygulamayı küçültme. İçerik sayfaları kendi dilinin ana sayfasına döner.
- Arka plandan dönüşte gerçek bitiş zamanı tekrar hesaplanır; soru süresi durmaz. Aktif tur geçici sekme depolamasından yenilemede geri getirilebilir; Android işlemi öldürüldüğünde WebView oturum depolamasının korunması garanti edilmez. Bu durumda kalıcı istatistik izni olmadan yeni kalıcı kayıt oluşturulmaz.
- Android çevrimdışı durumu uygulama içinde erişilebilir bir bildirimle açıklanır: yerel tek oyunculu oyun kullanılabilir, hesap ve çok oyunculu servisler bağlantı bekler. Ağ geri geldiğinde uygulama ekranları yeniden eşitleme olayı alır.
- Çok oyunculu son oda işaretçisi yalnızca oda UUID'sini ve Supabase kullanıcı UUID'sini içerir; oda kodu/takma ad/cevap içermez. Uygulama oda ekranı açıldığında sunucu üyeliği yeniden kontrol edilir. Ayrılma bu işaretçiyi siler. Misafir oturumu kalıcı depolamaya geçirilmediğinden misafir için işlem öldürülmesi sonrası dönüş garanti edilmez.
- Android'in yerel paylaşım menüsü kullanılır. Kullanıcı menüyü iptal ederse panoya habersiz kopyalama yapılmaz. Web Share/clipboard davranışı web sürümünde korunur.
- Sistem çubukları iki temada da beyaz simgeli marka lacivertidir; native inset'ler içeriği durum/gezinme çubuklarından ayırır. Uygulamanın içerik teması ilk açılışta gündüzdür; kullanıcı gece modunu seçerse sonraki açılışlarda bu tercih hatırlanır. Cihazın sistem teması içerik temasını otomatik değiştirmez.

## Kurulum ve Test

`npm ci`, `npm run android:apk`. Java 21 ve Android SDK gerekli; `JAVA_HOME` ve `ANDROID_HOME` ile yollar belirtilebilir. Android Studio'nun `jbr` derleyicisi veya bu bilgisayarda indirilen `.android-tools/jdk21` desteklenir. Gradle ilk çalıştırmada resmi bağımlılıkları indirebilir. Windows ASCII olmayan proje yolunu native derleme için geçici bir klasöre kopyalar; web projesinin yeri değişmez.

Çıktılar: `artifacts/ynby-android-test.apk`, `artifacts/android-reports`. APK debug imzalı test dosyasıdır; Play Store'a yüklenmemelidir. Telefon kendi başına uygulama kaynaklarını ve 580 soruyu içerir; sitede yeni soru yayımlamak APK içeriğini otomatik güncellemez. Gelecekte uygulama güncellemesi gerekir.

Telefon testi için APK'yı telefona aktarın ve yalnızca bu test için ilgili dosya yöneticisine bilinmeyen uygulama yükleme izni verin; yükleme sonrası izni kapatın. Alternatif: USB hata ayıklama açık ve bilgisayar yetkilendirilmişken `adb install -r artifacts/ynby-android-test.apk`. Mevcut bir uygulamayı kaldırmayın: kaldırma yerel skorları siler. Web tarayıcısındaki skorlar Android uygulamasına otomatik taşınmaz.

Kontrol listesi: iki dil, dört kategori ve seviye, tam tur, doğru/yanlış/süre dolması, çıkış/geri tuşu, arka planda 20 saniyeden uzun bekleme, kaynak bağlantısından geri dönüş, dil ve rehber geçişleri, karanlık/açık görünüm, paylaşım/iptal, yeniden açma, internet kapalı oyun, dar/geniş/döndürülmüş ekran.

## İlk Test Derlemesi: 29 Eylül 2026

- APK: `artifacts/ynby-android-test.apk`, 6.130.775 bayt; paket sürümü `0.1.0` (kod 1), Android 7.0/API 24 ve üzeri.
- SHA-256: `b2c098bd8b8e56371d497b042e00b7a08951e98d894587308e0f9cbf42cc8378`.
- Debug imzası `apksigner` ile doğrulandı; APK içindeki 140 web dosyası kaynak çıktıyla birebir eşleşti.
- Web lint, TypeScript ve production build başarılı; 40 JavaScript testi, 2 Android rota testi ve 9 masaüstü/tablet/mobil tarayıcı testi geçti.
- Android derleme ve lint başarılı, hata yok. Lint raporunda 19 uyarı var: şablon kaynakları/manifest sıralaması, bağımlılık sürüm önerileri ve yeni Android yedekleme kuralları. Bunlar mağaza hazırlığında ayrıca değerlendirilmeli.
- Bu son derlemenin raporları `artifacts/android-final-reports` içinde. Normal `android:apk` komutu `artifacts/android-reports` üretir.
- Tarayıcı testleri native köprüyü taklit eder; gerçek cihaz testi değildir. Emülatör bellek baskısı nedeniyle APK üzerinde oyun testi tamamlanmadı. Telefon kontrol listesi ve çevrimdışı çalışma doğrulaması hâlâ gerekli.
- Canlı web sitesine yayın veya Google Play'e yükleme yapılmadı.

## Samsung A50 Testi: 0.2.0

Bu sürümün kodu 2'dir. İsteğe bağlı Supabase üyeliği, Google girişi, native OAuth dönüş bağlantısı, en az altı karakter/harf/rakam doğrulaması, şifre tekrarı ve göster/gizle kontrolü içerir. Önceki APK `artifacts/ynby-android-test-0.1.0-backup.apk` dosyasında korunur. Yeni APK debug test sürümüdür; mağaza yayını değildir.

- APK: `artifacts/ynby-android-test.apk`, 6.423.367 bayt; Android API 24 ve üzeri, hedef API 36.
- SHA-256: `7360f0ff59f55e8fd33dd926137fdc030c4fb17a11634b2447662a931fe303b6`.
- APK v2 imzası ve paket sürümü doğrulandı. Paket içindeki 173 web dosyası eşitlenmiş kaynaklarla birebir karşılaştırıldı; hesap/gizlilik sayfaları, Browser eklentisi ve native dönüş intent'i mevcut.
- 49 birim testi, 21 üyelik tarayıcı testi ve ESLint geçti. Tarayıcı testleri Android Google dönüşünü üç ekran boyutunda taklit eder ve aynı kodun iki kez işlenmesini engellediğini kontrol eder.
- Gradle APK, unit test ve lint görevleri başarılı. Lint: sıfır hata, 19 uyarı; güncel raporlar `artifacts/android-0.2.0-reports` içinde. Mağaza hazırlığı ve gerçek Samsung A50 testi henüz tamamlanmadı.

USB dosya aktarımı için USB hata ayıklama gerekmez. Telefonun kilidini açıp USB bildiriminde dosya aktarımını seçin. Windows Dosya Gezgini'nde `artifacts/ynby-android-test.apk` dosyasını telefonun dahili depolamasındaki Download klasörüne kopyalayın. Telefonda Dosyalarım > İndirilenler üzerinden APK'yı açın. Gerekirse yalnızca Dosyalarım için bu kaynaktan yükleme izni verin; kurulum sonrası kapatın. Mevcut uygulamanın üzerine güncelleyin, kaldırmayın. İmza uyuşmazlığı olursa kayıtları silmek yerine hata metnini inceleyin.

Önce Google ile giriş: tarayıcı penceresinde kendi hesabınızı seçin, izinleri inceleyin ve uygulamaya dönüşü kontrol edin. Google şifresi yalnızca Google ekranında girilir. Uygulamadaki e-posta/şifre alanına Google şifresi yazılmaz. Android'in geri tuşuyla Google ekranını iptal edip uygulamaya dönmek de denenmelidir.

Ardından takma ad kaydı, uygulamayı kapatıp yeniden açınca oturum, on soruluk tur sonunda bulut rekoru ve aynı hesabın sitedeki rekoru kontrol edilir. Yeni e-posta hesabında kısa/sayısız/eşleşmeyen şifrelerin reddi, altı karakterli harf+rakam şifresi, iki şifre alanının göz düğmeleri ve e-posta doğrulaması denenir. Şifre, doğrulama kodu ve oturum bilgileri test raporunda paylaşılmaz.

Son olarak internet kapalı misafir oyunu, iki dil, telefonun geri tuşu, arka plandan dönüş ve paylaşımı iptal etme denenir. Hesap silme yalnızca silinebilecek ayrı bir test hesabıyla yapılır. Tarayıcıda native köprüyü taklit eden test gerçek Samsung testi yerine geçmez; cihaz sonuçları kullanıcı tarafından ayrıca doğrulanmalıdır.

## Mağaza Hazırlığı

Paket adı `com.yeninesilbilgiyarismasi.app`, `targetSdkVersion` 36 ve mevcut geliştirme sürümü `versionCode 7` / `versionName 0.6.0`'dır. Paket adını mağaza kaydından önce kesinleştirin; ilk yayın sonrası değişmesi yeni uygulama anlamına gelir. Release için Android App Bundle, kalıcı imzalama ve güvenli anahtar yedeği gerekir. Anahtar/şifreleri kaynak koduna veya sohbete koymayın. Play Console hesabı, kimlik doğrulaması, geçerli gizlilik politikası ve Data Safety formu, veri silme beyanları, içerik derecelendirmesi, mağaza varlıkları ve hesabın test şartları ayrıca tamamlanmalıdır. Yayın onayı garanti edilmez.

Kod tarafında mağaza öncesi kalan işler: misafir ve kayıtlı kullanıcı için gerçek cihazlarda çok oyunculu/lifecycle testleri; yayın imzasını kaybetmeden saklama prosedürü; Play Console Data Safety ve veri silme cevaplarının canlı davranışla karşılaştırılması; mağaza ekran görüntüleri ve Türkçe listeleme metni. Hesap oluşturma uygulama içinde bulunduğu için Play Store veri silme formunda hem uygulama içi silme yolunu hem de web üzerinden hesap silme talebi yolunu beyan edin. Geliştirici hesabı 13 Kasım 2023'ten sonra açılmış kişisel hesapsa en az 12 test kullanıcısıyla 14 gün kapalı test koşulunu Play Console'da doğrulayın. Bu beyanlar yalnızca proje kodundan tamamlanamaz ve hesap sahibinin Play Console'da onaylaması gerekir.

Yeni uygulama gönderimlerinde 31 Ağustos 2026'dan itibaren API 36 hedefi gerekir; proje şu anda API 36 hedefliyor. Bu yalnızca hedef API koşuludur, mağaza kabulü veya diğer politika koşullarının karşılandığı anlamına gelmez.

Resmî kaynaklar: [Capacitor Android](https://capacitorjs.com/docs/android), [App yaşam döngüsü](https://capacitorjs.com/docs/apis/app), [Paylaşım](https://capacitorjs.com/docs/apis/share), [Sistem çubukları](https://capacitorjs.com/docs/apis/system-bars), [Play Console](https://support.google.com/googleplay/android-developer/answer/6112435), [Yeni kişisel hesapların test şartları](https://support.google.com/googleplay/android-developer/answer/14151465).

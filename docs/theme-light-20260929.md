# Gündüz başlangıcı

Kullanıcının tercihi: ilk açılış tüm platformlarda gündüz; kullanıcı gece modunu seçerse sonraki açılışlarda seçim hatırlanır. `ynby-theme` anahtarı korunur. Eski açık/gece seçimleri silinmez. Cihazın `prefers-color-scheme` tercihi başlangıcı veya mevcut uygulama temasını değiştirmez. Depolama engellenirse ilk açılış yine gündüzdür ve o sayfada tema düğmesi çalışır.

Ortak `src/lib/theme.ts` ilk çizimden önceki script ve istemci tema değişimini yönetir. Türkçe/İngilizce ana sayfa, hesap, rehber, gizlilik ve 404 sayfaları aynı başlangıç kodunu kullanır. Web ve APK aynı kaynaktan derlenir.

51 birim testi, ESLint, web build ve 15 masaüstü/mobil/tablet tema ve Android köprüsü testi geçti. Canlı sitede üç ekran boyutunda sistem tercihi karanlıkken yeni ziyaret gündüz başlar; `/`, `/en`, `/hesap`, `/gizlilik` kontrol edildi, elle seçilen gece yenilemeden sonra korundu. Ekran görüntüleri `artifacts/theme-light` içinde.

Web yayını: `/var/www/yeninesilbilgiyarismasi`. Önceki site/Nginx yedeği `/var/backups/ynby/theme-light-20260929-112552`. Paket `.backups/theme-light-20260929.tar.gz`; SHA-256 `2dd98b1673fa6e219956434a6536d1a9790b3e7dd630c68b1cd35f613e370ba7`. Sunucuda checksum doğrulandı; dosya karşılaştırması fark vermedi. Eski paketler silinmedi; Nginx değiştirilmedi. Başka siteye ait mevcut IPv6 uyarısı aynen bırakıldı.

APK sürüm numarası `0.2.1`/kod 3 olarak artırıldı. Önceki `0.2.0` dosyası `artifacts/ynby-android-test-0.2.0-backup.apk` içinde korunur. Fiziksel telefonda yeni sürümün tema testi ayrıca kullanıcı tarafından yapılmalıdır; tarayıcı native köprü testi gerçek cihaz testi değildir.

Yeni APK `artifacts/ynby-android-test.apk`, 6.447.172 bayt. SHA-256 `0c53568948e95f0acec31a9075ff1025cb3d40d4edf5ea8f0905f5580a35a3ba`. Derleme, native unit test ve lint başarılı (0 hata, 19 uyarı); raporlar `artifacts/android-0.2.1-reports` içinde. Paket metadata/sürümü ve imza doğrulandı; önceki 0.2.0 ile aynı imza olduğundan kaldırmadan güncellenebilir. Android export'taki 171 dosya APK ile checksum üzerinden eşleşti; ana sayfa, İngilizce, hesap ve gizlilik HTML'lerinde gündüz başlangıç script'i kontrol edildi. Derleme için önceki doğrulanmış ASCII geçici dizinin Gradle önbelleği korundu ve yeni Capacitor çıktısı eşitlendi.

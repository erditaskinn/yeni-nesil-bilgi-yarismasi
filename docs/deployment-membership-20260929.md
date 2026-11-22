# Uyelik ve Google girisi web yayini

29 Eylul 2026 tarihinde kullanicinin yayin talebiyle mevcut statik web surumu Hetzner'e aktarildi. Android APK yeniden uretilmedi. Google Auth Platform Testing durumuna dokunulmadi; marka dogrulamasi ve hukuki yayin oncesi kontroller tamamlanmis sayilmaz.

- Sunucu: prod-web-01, 46.225.120.184.
- Web koku: /var/www/yeninesilbilgiyarismasi.
- Onceki site ve Nginx yedegi: /var/backups/ynby/membership-google-20260929-100336/site ve ayni dizindeki nginx.conf.
- Yerel paket: .backups/membership-google-20260929-100336.tar.gz.
- SHA-256: e6b626bdc3ff9898411a17092e5116d89fe1c0d9f649962f52a690183a8c9897.
- Paketin checksum'u sunucuda dogrulandi. Gecici dizinde acildi, once _next paketleri sonra sayfalar rsync ile aktarildi. Eski dosyalar/paketler silinmedi. Son checksum karsilastirmasi fark vermedi.
- Nginx dosyasi degistirilmedi veya yeniden yuklenmedi. nginx -t basarili; baska siteye ait kangarogo IPv6 protokol uyarisina dokunulmadi.
- Son kaynak derlemesi ve lint basarili; 49 birim/veritabani testi gecti. Onceki sahte API tarayici testlerinde Google PKCE dahil 18 senaryo gecti; bunlar gercek canli kullanici testi degildir.
- Canli /, /en, /gizlilik, /en/privacy, /hesap, /en/account, /hesap-silme, /en/delete-account HTTPS 200. Iki gizlilik sayfasinda kullanicinin onayladigi isletmeci adi dogrulandi.
- Canli hesap sayfalarinda 320 ve 1440 pikselde Google dugmesi etkin, sifre minimum 6, tekrar alani var, yatay tasma ve pageerror yok; _next paketlerinde HTTP hata gorulmedi.
- Kullanici daha once yerelde gercek Google girisiyle hesap olusturmayi dogruladi. Canli Google izin/donus ve hesap silme kullanici tarafindan ayrica denenmeli; asistan gercek hesap acmadi veya silmedi.

Siradaki adim Google Branding alanlarini canli ana sayfa/gizlilik URL'leriyle kaydetmek, alan adi sahipligini ve Verification Center durumunu kontrol etmektir. Google'i genel kullanima acmak, yurt disi veri aktarimi/saklama/hukuki sebep konularinin tamamlandigi anlamina gelmez. APK ve fiziksel cihaz testi ayri is kalemidir. GitHub commit/push yapilmadi.

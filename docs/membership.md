# Supabase Üyelik Kurulumu

## Kapsam

İsteğe bağlı e-posta/şifre üyeliği; iki dilde kayıt, doğrulama kodu, giriş, şifre yenileme, takma ad, kişisel rekor eşitlemesi ve kalıcı hesap silme. Misafir ve Android çevrimdışı oyun korunur. Yaş, telefon, gerçek ad, reklam veya sıralama eklenmez.

Web sitesi Hetzner'de statik kalır. Supabase Auth ve PostgreSQL ayrı bir projede çalışır. Şifreler uygulamanın veri tablolarına yazılmaz. `profiles` ve `personal_bests` tablolarında RLS, sahiplik denetimleri ve dış anahtarlarla silme uygulanır. Rekor RPC'si atomik maksimum tutar; en fazla 2000 puan kabul eder. Oyun ayarları değişirse SQL sınırı da güncellenmelidir. Puanlar istemci tarafından bildirilir: ödüllü veya rekabetçi yarışma güvenliği değildir.

Misafir rekoru otomatik aktarılmaz. Hesap rekorlarının cihaz önbelleği kullanıcı ID'sine ayrıdır; tur başlangıcındaki kimlik sonuç sahibini belirler. Günlük turlar, görülen sorular ve istatistik geçmişi buluta taşınmaz. Ağ hatası yerel oyunu engellemez; hesaba ait yerel rekorlar yeniden giriş/bağlantı ve Eşitle düğmesiyle tekrar denenir. Depolama engelliyse oturum yalnızca bellekte kalabilir ve çevrimdışı sonuç kalıcı olamaz.

## Ayrı Proje Oluşturma

1. Supabase panelinde bu site için boş ve ayrı proje oluşturun; başka bir çalışma için kullanılan projeyi yeniden kullanmayın. Avrupa/Frankfurt seçimi yapılabilir; veri bölgesi ve hukuki yükümlülükler yayın öncesi değerlendirilmeli.
2. Data API açık, yeni tablolara otomatik API yetkisi kapalı olsun. Otomatik RLS açılabilir; SQL ayrıca iki tabloda açıkça etkinleştirir.
3. Project URL ve `sb_publishable_` anahtarını `.env.local` içine yerleştirin (`.env.example` alanları). `service_role`/secret/veritabanı ve SMTP şifrelerini `NEXT_PUBLIC_*` içine, Git'e veya sohbete koymayın. Yapılandırma yoksa üyelik ekranı güvenle kapalı kalır.
4. SQL Editor'de `supabase/migrations/202609290001_membership.sql` dosyasının tamamını **bir kez** çalıştırın. Bu dosya sıfırdan oluşturma içindir; mevcut tabloların üzerine tekrar çalıştırmayın. Supabase yedeği/SQL migration kaydı dağıtım sürecinde ayrıca yönetilmelidir.

## Kimlik Doğrulama ve E-posta

Authentication > Sign In / Providers > Email: açık; Confirm email: açık. Minimum şifre uzunluğu 12; e-posta kodu ömrünü tercihen 10 dakika ile sınırlandırın. Sunucu tarafındaki Auth hız sınırlarını kontrol edin; ön yüzdeki 60 saniyelik bekleme tek başına güvenlik önlemi değildir. CAPTCHA widget'ı bu aşamada eklenmemiştir; yalnızca panelden CAPTCHA açmak kayıt/giriş işlemlerini bozar. Genel yayından önce gerekli bot koruması arayüz entegrasyonuyla ayrıca tamamlanmalı, e-posta gönderim sınırları test edilmelidir. Sosyal giriş ve telefon girişi bu sürümde yoktur.

Authentication > URL Configuration: Site URL `https://yeninesilbilgiyarismasi.com`. Akışta URL üzerinden oturum yakalama kullanılmaz (`detectSessionInUrl:false`): web ve Android'de kod girilir, deep link gerekmez. Kullanıcı kodu aynı uygulama ekranına girer.

Authentication > Email Templates: hem **Confirm signup** hem **Reset password** e-postalarının gövdesinde `{{ .Token }}` kullanın; mevcut `{{ .ConfirmationURL }}` bağlantısını kodla değiştirin. Örnek:

```html
<h2>Yeni Nesil Bilgi Yarışması / Next Gen Trivia Quiz</h2>
<p>Doğrulama kodun / Your verification code:</p>
<p><strong>{{ .Token }}</strong></p>
<p>Bu kodu paylaşma. İşlemi sen başlatmadıysan e-postayı yok say.</p>
<p>Do not share this code. Ignore this email if you did not request it.</p>
```

Üretimde özel SMTP gerekir: Supabase'in varsayılan gönderimi genel kullanıcılar için değildir. Güzel Hosting hesabının transactional gönderim izni, gerçek SMTP sunucusu, port/TLS, limitler, SPF/DKIM/DMARC ve teslimat durumu sağlayıcıyla doğrulanmalıdır; bunlar burada varsayılmaz. Mail şifresi yalnızca Supabase SMTP paneline girilir, site/APK içine konmaz. Gönderen olarak yetkilendirilmiş alan adresi kullanılmalıdır. Test kullanıcısına gerçek kayıt ve şifre yenileme e-postası gelmeden genel yayın yapmayın.

## Hesap Silme Fonksiyonu

`supabase/functions/delete-account` sunucu tarafındadır. `verify_jwt=true` bırakılır; uygulama `Authorization` başlığında giriş yapan kullanıcının JWT'sini, `apikey` başlığında public anahtarı gönderir. Güncel [gateway dokümanı](https://supabase.com/docs/guides/functions/auth-headers) hem legacy hem asimetrik JWT doğrulamasını desteklediğini belirtir. Handler ayrıca her çağrıda Bearer token'ı `auth.getUser` ile doğrular, güncel şifreyi tekrar kontrol eder, yalnızca token sahibini siler. API anahtarı kullanıcı kimliği yerine kabul edilmez; istekten kullanıcı ID'si alınmaz. Gövde, belleğe tamamı alınmadan önce 1024 baytla sınırlandırılır. Auth kullanıcısı silinince profil/rekorlar CASCADE ile kaldırılır.

Supabase CLI kurulup kendi hesabınıza giriş yapıldığında:

```sh
supabase login
supabase link --project-ref YOUR_NEW_PROJECT_REF
supabase functions deploy delete-account --project-ref YOUR_NEW_PROJECT_REF
```

`SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` hosted Edge Function ortamında sağlanır; istemciye aktarılmaz. Yanlış projeye link/deploy etmeyin. Fonksiyon deploy edilmeden silme düğmesi başarılı olamaz. Dashboard üzerinden dağıtımda hem `index.ts` hem `handler.ts` gerekir; Settings > Verify JWT with legacy secret açık bırakılır. Yerel testte `EXTRA_ALLOWED_ORIGINS` secret'ına yalnızca gereken tam kökenleri (bu test için `http://127.0.0.1:3100`) virgülle ekleyin. Üretim kökeni ve Android `https://localhost` kodda sınırlıdır; geniş wildcard eklemeyin. Yerel test izni yayın öncesinde kaldırılmalıdır.

Web üzerinden `/hesap-silme` ve `/en/delete-account`, uygulamada Hesabım > Hesabımı Sil bulunur. Şifre ve silme onayı gereklidir. Fonksiyon başarısızsa kullanıcıya silinmiş gibi bildirilmez. Erişim kurtarılamıyorsa kayıtlı adresten iletişim e-postasına talep yönlendirilir; işletmeci sahipliği doğrulayıp talepleri gerçekten işlemek zorundadır. Sağlayıcı yedekleri ve zorunlu güvenlik kayıtlarının saklama şartları ayrıca açıklanmalıdır.

## Kurulum Durumu (29 Eylül 2026)

- Yeni proje: `zhkvzvzegatrkdwrixyv`. İlk SQL migration kullanıcı tarafından çalıştırıldı; anonim API anahtarıyla profil ve rekor tablolarının okunamadığı ayrıca kontrol edildi. Migration tekrar çalıştırılmamalı.
- Güzel Hosting destek yanıtı SMTP sunucusunu `mail.guzel.net.tr`, portu `465`, güvenliği SSL/TLS olarak doğruladı. Kullanıcı bu ayarları Supabase'e kaydetti; şifre alınmadı veya proje dosyalarına yazılmadı. Otomatik gönderim izni, limitler ve SPF/DKIM/DMARC incelemesi halen yayın kontrolüdür.
- Kullanıcı Confirm signup ve Reset password şablonlarını TR/EN kod içerikleriyle kaydetti; Site URL üretim alan adına ayarlandı. Auth API kontrolünde kayıt ve e-posta girişi açık, e-posta doğrulaması zorunlu.
- Kullanıcının bildirdiği gerçek testler: kayıt kodu e-postası ulaştı, kodla Hesabım ekranı açıldı, tamamlanan turun rekoru hesapta ve gizli penceredeki yeniden girişte göründü. Şifre yenileme kodu, yeni şifre belirleme ve yeni şifreyle tekrar giriş de başarılı bildirildi. Bu testler yerel web arayüzü ve gerçek Supabase projesiyle yapıldı; gerçek posta teslimatı otomatik testlerle taklit edilmiş gibi değerlendirilmemeli.
- Kullanıcı `delete-account` Edge Function'ını iki dosyayla Dashboard üzerinden dağıttı; Settings ekranında fonksiyon adı ve JWT kontrolünün açık olduğu görüldü. `EXTRA_ALLOWED_ORIGINS` ile yerel test kökeni eklendi. Gerçek endpoint üzerinde üretim ve yerel CORS ön kontrolleri 204, oturumsuz ve yalnızca public anahtar içeren silme istekleri 401 döndü; bu otomatik kontroller hiçbir hesabı silmedi.
- Kullanıcı yanlış şifreyle silmenin engellendiğini, doğru şifreyle test hesabının silindiğini ve silinen hesapla yeniden girişin reddedildiğini doğruladı. İki ayrı test hesabıyla, A hesabının rekorunun B'de görünmediği ve B'nin farklı kategorideki rekorunun A'da görünmediği de kullanıcı tarafından doğrulandı. Bu arayüz kontrolleri, iki hesapla kötü niyetli doğrudan API isteklerinin ayrıca test edildiği anlamına gelmez.
- Bekleyenler: yayın öncesi bot koruması ve gönderim limitleri, gizlilik metninin kesinleştirilmesi, gerektiğinde iki gerçek hesabın yetkisiz doğrudan API istekleriyle ek RLS kontrolü ve Android üyelik testi. Üyelik canlı web sitesine dağıtılmadı; Android test paketinin üyelikli sürümü ayrıca üretilmelidir.

## Kontroller ve Yayın

Supabase bcrypt şifre sınırı 72 UTF-8 baytıdır; arayüz yeni şifrede en az 6 karakter, en az bir ASCII harf (A–Z/a–z), en az bir rakam ve bu bayt sınırını birlikte kontrol eder. Kayıt ve şifre yenileme şifre tekrarı ister; tüm şifre alanları göster/gizle düğmesine sahiptir. Kullanıcı panelde minimum 6 ve Letters and digits seçeneğini kaydettiğini bildirdi. 6 karakter, önerilen 8 karakterden daha zayıf bir tercihtir. Çok baytlı Türkçe karakterler için sınır testleri vardır. Kaynak: [Supabase parola kontrolü](https://github.com/supabase/auth/blob/master/internal/api/password.go).

Google OAuth web/Android kod hazırlığı ve panel kurulumu: [Google giriş rehberi](google-auth.md). Gerçek Google oturum açma, hesap bağlantısı ve Android fiziksel cihaz dönüşü henüz doğrulanmadı; düğme panel kurulumu tamamlanana kadar etkinleştirme bayrağıyla kapalı tutulur.

- `npm test`: oyun testleri, oturum/kimlik ayrımı, silme handler'ı ve PostgreSQL motorunda gerçek SQL/RLS testi (PGlite sadece geliştirme bağımlılığıdır).
- `npm run test:membership`: gerçek Supabase'e veri göndermeden SDK/API sözleşmesini taklit eden masaüstü/mobil/tablet testleri. Sahte public değerler yalnızca `membership-test-out` çıktısına girer; bu klasörü **yayınlamayın**. Gerçek e-posta veya hosted servis testi değildir.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.
- `.env.local` değişince dev server yeniden başlatılmalı; statik web ve APK yeniden üretilmelidir. Anahtarları Nginx web klasörüne kopyalamayın.
- Canlı SQL, Edge Function, SMTP, iki gerçek hesapla RLS/çıkış/silme ve yeniden giriş, rekor eşitleme, e-posta teslimatı ve gerçek Android testi tamamlanmadan üyeliği genel kullanıma açmayın.
- `/gizlilik` ve İngilizce karşılığı teknik taslaktır; işletmeci kimliği, veri işleme dayanakları/aktarımı, haklar ve saklama süreleri uygun hukuki incelemeyle kesinleştirilmelidir. KVKK/GDPR uygunluğu burada garanti edilmez. Play Console Data Safety beyanını üyeliğe göre güncelleyin.

Kaynaklar: [Supabase Auth](https://supabase.com/docs/guides/auth), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Kod şablonları](https://supabase.com/docs/guides/auth/auth-email-templates), [API anahtarları](https://supabase.com/docs/guides/api/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Play hesap silme](https://support.google.com/googleplay/android-developer/answer/13327111).

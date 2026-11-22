# Kişiselleştirilmiş zorluk: ilk politika taslağı

Tarih: 9 Kasım 2026.

## Durum

`src/lib/adaptive-difficulty.ts` karar fonksiyonları Türkçe ortak tek kişilik oyun akışına bağlandı. Kategori seçiminden sonra klasik ve uyarlanabilir mod seçenekleri gösterilir. Klasik akış oyuncunun sabit seviye seçimini korur. Uyarlanabilir akış, seçili kategorideki izinli Bilgi Profili verisiyle başlangıç seviyesini belirler; yeterli profil yoksa orta seviyeden başlar. Uyarlanabilir mod kendi tur türüdür: her cevap sonrası yeni ve oturumda sorulmamış bir soru eklenir. Yanlış cevap açıklama ve doğru yanıt geri bildirimini gösterir, fakat tur sürer; oyuncu “Turu bitir” ile sonuçlara geçer. Yalnızca soru havuzunun tükenmesi otomatik bitişe yol açar. Her beş cevapta seviye performansa göre güncellenir ve oyuncuya seviye göstergesi sunulur. Tur oturumu yenilemeden geri yüklenirken uyarlanabilir bilgisi korunur. Klasik Sonsuz Tur'un yanlış cevapta bitme kuralı değişmedi.

Bu parça web ve APK'nın kullandığı ortak tek kişilik oyun kodundadır. İngilizce akışına, APK'ya özel çok oyunculu akışa, APK derlemesine ve canlı yayına dokunulmadı. Bu entegrasyon için test çalıştırılmadı.

## İlk eşikler

### 22 Kasım 2026 sonuç ve geçiş özeti

Türkçe uyarlanabilir sonuç ekranına başlangıç hedefi, bitiş hedefi ve kaydedilmiş geçmiş varsa en yüksek hedef eklendi. Başlangıç-bitiş farkı basamak olarak gösterilir; bunlar oyuncunun kalıcı beceri puanı değil, bu turdaki soru zorluğu hedefleridir. Açılır geçiş listesi her değişimin kaçıncı cevaptan sonra olduğunu ve performansa dayalıysa son beş cevaptaki doğru sayısını gösterir. Soru bulunabilirliğinden kaynaklanan geçişler ayrı açıklanır. Sıfır cevap ve beş cevaptan önce bitirilen turlar için uygun açıklamalar vardır. Oyun sırasında hedef değişimi ekran okuyucularına da duyurulur.

`GameState.adaptiveProgress` başlangıcı ve gerçekleşen hedef değişimlerini taşır. Oturum geri yüklenirken geçmişin seviyeleri, sırası, cevap sınırları ve son hedefi doğrulanır; geçersiz veya eski eksik geçmiş gösterilmez, başlangıç ve bitiş hedefleri yine mevcut turdan gösterilir. Hedef değiştiğinde önceki seviyede kuyrukta kalmış sorular olabildiğinden uyarlanabilir oturumun geri yükleme kontrolü bu duruma izin verir. Soru seçimi ve beşli performans eşikleri bu adımda değiştirilmedi.

`npx tsc --noEmit --incremental false` geçti. Kullanıcının isteği doğrultusunda yeni test veya tarayıcı testi çalıştırılmadı; görsel ve oyun akışı denetimi kullanıcı tarafından yapılacak. İngilizce akışa ve APK'ya özel çok oyunculu koduna dokunulmadı; canlı yayın veya APK derlemesi yapılmadı.

- Kişinin seçili kategoride en az 5 farklı soruya verdiği yanıt varsa profil oranı başlangıç seviyesini belirleyebilir. Profil yetersizse başlangıç `medium` olur.
- Başlangıç seviyesi doğruluğa göre belirlenir: `%40` altı `easy`, `%40–64` `medium`, `%65–84` `hard`, `%85` ve üstü `expert`.
- Tur sırasında her 5 cevapta bir son 5 cevaba bakılır. En az 4 doğru bir seviye yükseltir; en fazla 2 doğru bir seviye düşürür; 3 doğru seviyeyi korur.
- Her kontrol noktasında en fazla bir basamak değişir. Yalnızca seçilen kategori ve tur için sorusu bulunan seviyeler kullanılabilir. Eşit uzaklıkta daha kolay seviye seçilir; kullanılabilir seviye yoksa politika `null` döndürür.

Eşikler başlangıç varsayımlarıdır; oyuncu verisiyle kalibre edilmediler. Politika modülü depolamayı, profil oluşturmayı veya soru seçimini kendisi yapmaz. Entegrasyon aşamasında giriş yapan hesap için mevcut eşitlenen Bilgi Profili; izinli misafir oturumunda cihazdaki Bilgi Profili kullanılmalıdır. Kayıt izni olmayan oturumlar için mevcut gizlilik davranışı korunmalıdır.

## Sonraki gözden geçirme

Toplu test sırasında web ve APK'da mod seçimi, başlangıç seviyesi, beş cevaplık geçiş, az soru bulunan kategoriler ve oturum geri yükleme kontrol edilmeli. Eşikler başlangıç varsayımıdır; oyuncu verisiyle kalibre edilmediler.

# Google ile giris

Kod hazirligi: web ve Android PKCE kullanir. Web ayni kokendeki `/hesap` veya `/en/account` sayfasina doner; kod tarayicida oturuma cevrilip URL temizlenir. Android resmi Capacitor Browser (Custom Tabs) ile acilir ve kayitli uygulama baglantisi ile doner. Google sifresi uygulamaya girilmez. Gmail/Drive/YouTube erisimi istenmez; temel profil ve e-posta kullanilir.

## Panel kurulumu

1. Google Cloud'da bu site icin proje sec veya olustur.
2. Google Auth Platform: Branding, Audience ve Data Access ayarlarini tamamla. Uygulama adi Yeni Nesil Bilgi Yarismasi; destek e-postasi yonettigin adres; ana sayfa ve gizlilik URL'leri canli sitedeki sayfalardir. Temel `openid`, `userinfo.email`, `userinfo.profile` kapsamlari disinda izin ekleme.
3. Audience External; test asamasinda Testing ve kendi Google hesabini test kullanicisi olarak ekle. Genel yayin icin Production durumunu ve gereken marka/dogrulama islemlerini tamamla.
4. Clients -> Create client -> Web application. Authorized JavaScript origins: `https://yeninesilbilgiyarismasi.com`, yerel test icin `http://127.0.0.1:3100`.
5. Authorized redirect URI: `https://zhkvzvzegatrkdwrixyv.supabase.co/auth/v1/callback`. Supabase Google provider ekranindaki URL ile birebir dogrula.
6. Client ID ve Client Secret degerlerini yalnizca Supabase Authentication -> Sign In / Providers -> Google alanlarina gir ve etkinlestir. Secret sohbet, kaynak kod, `.env.local`, APK veya `NEXT_PUBLIC_*` alanina konulmaz. Nonce ve e-posta dogrulama kontrollerini kapatma.
7. Supabase Authentication -> URL Configuration -> Redirect URLs listesine tam adresleri ekle:
   - `https://yeninesilbilgiyarismasi.com/hesap`
   - `https://yeninesilbilgiyarismasi.com/en/account`
   - `http://127.0.0.1:3100/hesap`
   - `http://127.0.0.1:3100/en/account`
   - `com.yeninesilbilgiyarismasi.app://auth/callback?locale=tr`
   - `com.yeninesilbilgiyarismasi.app://auth/callback?locale=en`
8. Kurulum tamamlaninca `.env.local` icinde `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` yapip web/Android yeniden derlenir. Kurulumdan once dugme devre disidir.

Google-only hesaplarin site sifresi yoktur. Hesap silme fonksiyonu JWT ve site sifresini birlikte dogruladigi icin Hesap Sifresi Olustur ile e-posta kurtarma kodu kullanilarak bir site sifresi olusturulabilir. Google sifresi asla istenmez. Google ve e-posta hesaplarinin ayni adreste otomatik baglanma davranisi gercek hesapla dogrulanmalidir; elle provider/kimlik metadata'sina guvenerek hesap birlestirmeyiz.

## Durum

Kullanici Google Cloud web istemcisini, Supabase Google provider ayarlarini ve Google test kullanicisini kaydettigini bildirdi. Supabase'deki alti tam donus adresi ekran goruntusunde kontrol edildi. Yerel `.env.local` bayragi etkinlestirildi ve web yeniden derlendi. Gercek Google girisi ve hesap baglantisi henuz kullanici tarafindan test edilmedi. Android tarayici donusu fiziksel cihazda test edilmeli; yeni APK henuz uretilmedi. Canliya alinmadi. Takma ad icin mevcut veritabani tetikleyicisi Google kullanicisina `Oyuncu` atar; kullanici hesabinda degistirebilir.

Kaynaklar: [Supabase Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [Supabase mobil baglantilar](https://supabase.com/docs/guides/auth/native-mobile-deep-linking), [Capacitor Browser](https://capacitorjs.com/docs/apis/browser), [Capacitor App](https://capacitorjs.com/docs/apis/app).

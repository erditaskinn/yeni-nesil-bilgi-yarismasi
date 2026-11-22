# Teknoloji ve Sinema/TV soru paketi (30 Eylul 2026)

## Kapsam

- Teknoloji: 10 kolay + 10 orta = 20 yeni soru (`t001`-`t020`).
- Sinema ve Televizyon: 10 kolay + 10 orta = 20 yeni soru (`f001`-`f020`).
- Toplam havuz 580'den 620'ye cikti. Eski 580 soru, kimlikleri, cevaplari ve kayitlari degismedi.
- Turkce ve Ingilizce ayni kimlikleri ve dogru cevap kimliklerini kullanir. Her yeni soruda dort secenek, kisa aciklama, kaynak URL'si ve inceleme tarihi bulunur.
- Yeni kategorilerde kolay ve orta seviyelerde 5/10 soruluk turlar tam havuzla calisir. 20 soruluk tur secilirse mevcut 10 soruyla sinirli oldugu arayuzde belirtilir. Zor ve uzman seviyeleri henuz bos oldugu icin secilemez.
- Turkce/Ingilizce kategori sayfalari ve sitemap girdileri eklendi. Veritabani semasi degismedi; daha once uygulanan kategori migration'i bu degerleri zaten kabul ediyor.

## Kaynaklar

Teknoloji sorulari [CERN Web tarihi](https://home.cern/science/computing/the-birth-of-the-web/short-history-web/), [W3C web standartlari](https://www.w3.org/wiki/The_web_standards_model_-_HTML_CSS_and_JavaScript) ve [Computer History Museum zaman cizelgesi](https://www.computerhistory.org/timeline/1977/) ile kontrol edildi. Sinema/TV sorulari [Academy Awards toren kayitlari](https://www.oscars.org/oscars/ceremonies/2020) ile [Television Academy kayitlarina](https://www.televisionacademy.com/academy/about/history) dayaniyor. Soru basina kesin kaynak baglantisi `src/data/questions-new-topics.ts` dosyasindadir.

## Dogrulama ve yayin

- `npm run test`: 72/72 gecti. `npm run lint` ve `npm run build` basarili.
- Yeni iki kategoriden gercek tur baslatma ve Ingilizce sayfalari kontrol etme E2E testi masaustu, mobil ve tablette 3/3 gecti. Diger kategori/tempo E2E testleri ilk taramada 12/12 gecti; ek testin oturum koruma davranisina gore duzeltilmis hali yeniden kosuldu.
- Canli site yedegi: `/var/backups/ynby/new-topics-20260930-prepublish`. Paket: `.backups/new-topics-20260930.tar.gz`, SHA-256 `59fa6bc1f4c637671ae70d5131399217a8a7bfd2eb7f8908bd3202ff76c0fa8e`.
- Site dosyalari silinmeden once statik varliklar, sonra HTML sayfalari aktarildi. Son `rsync -rcni` farki sifir. Nginx yapilandirma testi basarili; baska siteye ait mevcut `kangarogo` IPv6 uyarisina dokunulmadi. Yeni TR/EN kategori URL'leri ve sitemap HTTPS uzerinden `200` dondu.
- Android APK **bu calismada derlenmedi veya degistirilmedi**. Mevcut test APK'si halen 580 soruluk onceki havuzu icerir. Kullanici komut verdiginde yeni web ciktisi Capacitor'a esitleyip APK yeniden derlenecek.

import { levelBalanceQuestions as make } from "./level-balance-format";
const charter = "https://www.un.org/en/about-us/un-charter/full-text";
const nobel = "https://www.nobelprize.org/prizes/facts/nobel-prize-facts/";
export const levelGeneral = [
  ...make("tlgh", "general_knowledge", "hard", charter, [
    ["BM Güvenlik Konseyinin geçici üyeleri kaç yıllığına seçilir?", ["İki", "Bir", "Dört", "Altı"], "BM Şartı'nın 23. maddesi geçici üyeler için iki yıllık görev süresi belirler."],
    ["BM Güvenlik Konseyinden ayrılan geçici üye hemen yeniden seçilebilir mi?", ["Hayır, hemen yeniden seçilemez", "Evet, sınırsızca", "Yalnız veto kullanırsa", "Yalnız başkanlık yaparsa"], "23. madde, süresi dolan geçici üyenin hemen yeniden seçilemeyeceğini söyler."],
    ["BM Genel Kurulunda önemli konulardaki kararlar hangi çoğunlukla alınır?", ["Hazır bulunan ve oy verenlerin üçte ikisi", "Her durumda oybirliği", "Yalnız beş daimi üyenin oyuyla", "Oy verenlerin dörtte biri"], "18. madde önemli konular için hazır bulunan ve oy veren üyelerin üçte ikisini arar."],
    ["BM Genel Kurulunun başkanını hangi organ seçer?", ["Genel Kurulun kendisi", "Güvenlik Konseyi", "Uluslararası Adalet Divanı", "Dünya Bankası"], "21. madde Genel Kurulun her oturum için başkanını seçmesini öngörür."],
    ["BM'ye yeni bir devletin üyeliğine, Güvenlik Konseyi önerisinden sonra hangi organ karar verir?", ["Genel Kurul", "Sekretarya", "Vesayet Konseyi", "Uluslararası Adalet Divanı"], "4. madde üyeliğin Güvenlik Konseyinin önerisi üzerine Genel Kurul kararıyla gerçekleşeceğini belirtir."],
    ["BM Şartı'na göre Genel Sekreter kuruluşun hangi görevlisidir?", ["Baş idari görevlisi", "Daimi askerî komutanı", "Uluslararası başyargıcı", "Bütün devletlerin devlet başkanı"], "97. madde Genel Sekreteri kuruluşun baş idari görevlisi olarak tanımlar."],
    ["BM'nin resmî dil metinlerinin saklandığı özgün Şart hangi ülkenin arşivine bırakılmıştır?", ["Amerika Birleşik Devletleri", "İsviçre", "Fransa", "Birleşik Krallık"], "111. madde özgün Şart'ın ABD Hükümeti arşivlerinde saklanacağını belirtir."],
    ["BM Şartı'na göre Genel Kurul olağan olarak ne sıklıkla toplanır?", ["Yılda bir", "Beş yılda bir", "On yılda bir", "Yalnız savaş çıkınca"], "20. madde yıllık olağan oturumları ve gerekli özel oturumları öngörür."],
    ["BM Şartı ile başka bir uluslararası anlaşmadaki yükümlülükler çatışırsa hangisi üstün gelir?", ["BM Şartı yükümlülükleri", "Daha eski anlaşma", "Daha kısa anlaşma", "Her zaman ticaret anlaşması"], "103. madde Şart'tan doğan yükümlülüklere öncelik verir."],
  ]),
  ...make("tlgp", "general_knowledge", "expert", "https://www.bipm.org/en/measurement-units/si-prefixes", [
    ["SI'da 10 üzeri 30 çarpanını hangi önek gösterir?", ["Quetta", "Ronna", "Yotta", "Zetta"], "BIPM tablosunda quetta, 10 üzeri 30'dur ve simgesi Q'dur."],
    ["SI'da ronna önekinin çarpanı hangisidir?", ["10 üzeri 27", "10 üzeri 24", "10 üzeri 21", "10 üzeri 18"], "Ronna öneki 10 üzeri 27 çarpanını gösterir."],
    ["SI'da quecto öneki hangi çarpanı belirtir?", ["10 üzeri −30", "10 üzeri −27", "10 üzeri −24", "10 üzeri −21"], "BIPM tablosunda quecto, 10 üzeri −30 çarpanını belirtir; simgesi q'dur."],
    ["SI'da ronto önekinin simgesi hangisidir?", ["r", "R", "q", "Q"], "Ronto için küçük r, ronna için büyük R kullanılır."],
    ["SI'da zetta öneki hangi çarpanı gösterir?", ["10 üzeri 21", "10 üzeri 18", "10 üzeri 15", "10 üzeri 12"], "Zetta'nın çarpanı 10 üzeri 21, simgesi Z'dir."],
    ["SI'da zepto önekinin çarpanı hangisidir?", ["10 üzeri −21", "10 üzeri −18", "10 üzeri −15", "10 üzeri −12"], "Zepto 10 üzeri −21 çarpanını gösterir."],
    ["SI'da atto önekinin çarpanı hangisidir?", ["10 üzeri −18", "10 üzeri −9", "10 üzeri −12", "10 üzeri −24"], "Atto'nun çarpanı 10 üzeri −18, simgesi a'dır."],
  ]),
  ...make("tlgc", "general_knowledge", "expert", "https://www.bipm.org/en/measurement-units/si-defining-constants", [
    ["SI tanımında sezyumun aşırı ince geçiş frekansı tam olarak kaç hertz alınır?", ["9.192.631.770", "9.192.631", "299.792.458", "6.022.140.760"], "SI'da sezyum geçiş frekansı 9.192.631.770 Hz olarak sabitlenmiştir."],
    ["SI'da ışığın boşluktaki hızı tam olarak kaç metre/saniyedir?", ["299.792.458", "300.000.000", "299.792", "9.192.631.770"], "Tanımlayıcı sabit c, tam 299.792.458 m/s'dir."],
    ["SI'da Planck sabitinin tam değeri hangi seçenektir?", ["6,62607015 × 10⁻³⁴ J·s", "6,62607015 × 10⁻²³ J·s", "1,380649 × 10⁻³⁴ J·s", "1,602176634 × 10⁻¹⁹ J·s"], "BIPM Planck sabitini tam 6,62607015 × 10⁻³⁴ J·s olarak verir."],
    ["SI tanımındaki temel elektrik yükünün tam değeri hangisidir?", ["1,602176634 × 10⁻¹⁹ C", "1,602176634 × 10¹⁹ C", "6,62607015 × 10⁻³⁴ C", "1,380649 × 10⁻²³ C"], "Temel yük e tam 1,602176634 × 10⁻¹⁹ coulombdur."],
    ["SI'da Boltzmann sabitinin tam değeri hangisidir?", ["1,380649 × 10⁻²³ J/K", "1,380649 × 10²³ J/K", "6,02214076 × 10²³ J/K", "6,62607015 × 10⁻³⁴ J/K"], "Boltzmann sabiti 1,380649 × 10⁻²³ J/K olarak tanımlanır."],
    ["SI'da Avogadro sabitinin tam değeri hangisidir?", ["6,02214076 × 10²³ mol⁻¹", "6,02214076 × 10⁻²³ mol⁻¹", "6,62607015 × 10²³ mol⁻¹", "1,380649 × 10²³ mol⁻¹"], "Avogadro sabitinin tam değeri 6,02214076 × 10²³ mol⁻¹'dir."],
    ["SI tanımında belirlenmiş görünür ışınımın ışık etkinliği kaç lümen/watt alınır?", ["683", "273", "1000", "555"], "Kcd tanımlayıcı sabiti tam 683 lm/W'tır."],
  ]),
  ...make("tlgu", "general_knowledge", "expert", charter, [
    ["BM Şartı'nın Güvenlik Konseyindeki oy usulünü düzenleyen maddesi hangisidir?", ["27", "18", "51", "108"], "Güvenlik Konseyi oylamalarını 27. madde düzenler."],
    ["Güvenlik Konseyinde usul kararları için en az kaç olumlu oy gerekir?", ["9", "5", "7", "15"], "Güncel 27. madde usul konularında dokuz olumlu oy arar."],
    ["BM Şartı'nın 108. maddesinde değişikliklerin yürürlüğe girmesi için gereken onay oranı nedir?", ["Daimi üyeler dahil üyelerin üçte ikisi", "Yalnız üyelerin yarısı", "Yalnız beş daimi üye", "Üyelerin dörtte biri"], "108. madde, bütün daimi üyeler dahil üyelerin üçte ikisinin onayını ister."],
    ["BM Şartı'nın 19. maddesindeki oy hakkı sınırı, hangi süreye ait aidat borcuyla ilişkilidir?", ["Önceki iki tam yıl", "Önceki iki ay", "Önceki beş yıl", "Yalnız içinde bulunulan gün"], "Borç önceki iki tam yılın katkı tutarına eşit veya fazla olursa 19. madde gündeme gelir; istisna izni mümkündür."],
    ["BM Şartı'nda meşru savunma hakkını açıkça tanıyan madde hangisidir?", ["51", "4", "18", "97"], "51. madde silahlı saldırı halinde bireysel veya ortak meşru savunma hakkını tanır."],
    ["BM Şartı'nın 109. maddesine göre gözden geçirme konferansı için Güvenlik Konseyinde kaç üyenin oyu gerekir?", ["Herhangi dokuz üyenin", "Yalnız beş daimi üyenin", "Bütün on beş üyenin", "Yalnız başkanın"], "109. madde Genel Kurulun üçte ikisinin yanında Konseyin herhangi dokuz üyesinin oyunu ister."],
    ["BM Şartı'nın başlangıçtaki eşit derecede geçerli beş dil metni arasında hangisi yoktu?", ["Arapça", "Çince", "Rusça", "İspanyolca"], "111. madde Çince, Fransızca, Rusça, İngilizce ve İspanyolca özgün metinleri sayar; bu, bugünkü resmî dil sayısıyla karıştırılmamalıdır."],
  ]),
  ...make("tlgn", "general_knowledge", "expert", nobel, [
    ["Nobel'in ölümden sonra verilemeyeceği kuralı tüzükte hangi yıldan itibaren yer alır?", ["1974", "1901", "1945", "1991"], "1974'ten beri, ölüm ödül açıklandıktan sonra olmadıkça ölümden sonra Nobel verilmez."],
    ["2011 Nobel Tıp Ödülü açıklanırken daha önce öldüğü bilinmeyen bilim insanı kimdi?", ["Ralph Steinman", "Frederick Sanger", "John Bardeen", "Linus Pauling"], "Ralph Steinman'ın açıklamadan üç gün önce öldüğü sonradan öğrenildi; ödülü korundu."],
    ["İki Nobel Ödülü'nü de paylaşmadan alan tek kişi kimdir?", ["Linus Pauling", "Marie Curie", "John Bardeen", "Frederick Sanger"], "Pauling, 1954 Kimya ve 1962 Barış ödüllerini tek başına aldı."],
    ["Linus Pauling'in Nobel Barış Ödülü hangi yıla aittir?", ["1962", "1954", "1974", "1982"], "Pauling'in Barış Ödülü 1962, Kimya Ödülü 1954 yılına aittir."],
    ["Fizik, kimya, tıp ve edebiyat Nobel madalyalarının ortak ön yüzünde hangi tarihler yazılıdır?", ["1833–1896", "1801–1901", "1845–1910", "1901–1974"], "Madalyaların ortak ön yüzü Alfred Nobel'in portresini ve doğum-ölüm yıllarını taşır."],
    ["Nobel Vakfı tüzüğüne göre bir ödül en fazla kaç kişi arasında paylaşılabilir?", ["Üç", "İki", "Dört", "Beş"], "Bir ödül en fazla üç kişi arasında paylaştırılabilir; kuruluş ödülleri ayrı değerlendirilir."],
    ["İlk Nobel Barış Ödülü'nü alan Henry Dunant hangi kuruluşun kurucusuydu?", ["Uluslararası Kızılhaç Komitesi", "UNESCO", "Milletler Cemiyeti", "Dünya Sağlık Örgütü"], "Nobel kaydı Dunant'ı Uluslararası Kızılhaç Komitesinin kurucusu olarak anar."],
  ]),
];

import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  http: "https://www.rfc-editor.org/rfc/rfc9110.html",
  css2: "https://www.w3.org/press-releases/1998/css2/",
  oscars1935: "https://www.oscars.org/oscars/ceremonies/1935",
  oscars1941: "https://www.oscars.org/oscars/ceremonies/1941",
  oscars1943: "https://www.oscars.org/oscars/ceremonies/1943",
  vowels: "https://tdk.gov.tr/icerik/yazim-kurallari/unlulerin-nitelikleri/",
  vowelDrop: "https://tdk.gov.tr/icerik/yazim-kurallari/unlu-dusmesi/",
} as const;

function q(
  id: string, difficulty: Difficulty, category: Exclude<GameCategory, "mixed">,
  question: string, options: [string, string, string, string],
  explanation: string, source: keyof typeof sources,
): Question {
  return {
    id, difficulty, category, question,
    choices: [
      { id: `${id}-0`, text: options[0] },
      { id: `${id}-1`, text: options[1] },
      { id: `${id}-2`, text: options[2] },
      { id: `${id}-3`, text: options[3] },
    ],
    correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-14",
  };
}

export const turkishMilestoneOne: readonly Question[] = [
  q("trd001", "easy", "technology", "Bir web sunucusu yeni bir kaynak oluşturduğunda hangi HTTP durum kodunu döndürür?",
    ["201", "204", "404", "503"], "RFC 9110'da 201 Created, isteğin yeni bir kaynak oluşturduğunu bildirir.", "http"),
  q("trd002", "medium", "technology", "HTTP 204 yanıtının temel özelliği nedir?",
    ["Yanıt gövdesi taşımaz", "Kaynak kalıcı taşınmıştır", "Kimlik doğrulama ister", "Sunucu geçici kapalıdır"], "204 No Content, istek başarılı olsa da yanıt içeriği bulunmadığını belirtir.", "http"),
  q("trd003", "medium", "technology", "Bir kaynağın kalıcı olarak başka adrese taşındığını hangi HTTP kodu bildirir?",
    ["301", "201", "400", "503"], "RFC 9110'da 301 Moved Permanently kalıcı yönlendirmeyi tanımlar.", "http"),
  q("trd004", "easy", "technology", "HTTP 404 yanıtı en doğrudan neyi ifade eder?",
    ["İstenen kaynak bulunamadı", "İstek başarıyla tamamlandı", "Sunucu yeni kaynak oluşturdu", "İçerik değişmedi"], "404 Not Found, sunucunun istenen kaynağı bulamadığını belirtir.", "http"),
  q("trd005", "medium", "technology", "HTTP 405 yanıtı hangi duruma karşılık gelir?",
    ["İstek yöntemi desteklenmiyor", "Kaynak bulunamadı", "Sunucu yeni kaynak oluşturdu", "İçerik bulunmuyor"], "405 Method Not Allowed, hedef kaynağın istenen yöntemi desteklemediğini bildirir.", "http"),
  q("trd006", "hard", "technology", "HTTP 429 yanıtı bir istemciye neyi söyler?",
    ["Çok fazla istek gönderildiğini", "Kaynağın kalıcı taşındığını", "Yanıtın gövdesiz olduğunu", "Kaynağın silindiğini"], "429 Too Many Requests, istemcinin belirli bir sürede fazla istek gönderdiğini belirtir.", "http"),
  q("trd007", "easy", "technology", "Sunucu tarafındaki beklenmeyen bir hatayı hangi HTTP durum kodu belirtir?",
    ["500", "200", "301", "404"], "500 Internal Server Error, sunucunun beklenmeyen bir durumla karşılaştığını bildirir.", "http"),
  q("trd008", "medium", "technology", "Bir sunucunun geçici olarak hizmet veremediğini hangi HTTP kodu belirtir?",
    ["503", "201", "301", "401"], "503 Service Unavailable genellikle geçici hizmet verememe durumunu anlatır.", "http"),
  q("trd009", "hard", "technology", "W3C, CSS2'yi hangi yılda tavsiye olarak yayımladı?",
    ["1998", "1992", "2004", "2012"], "W3C, CSS2 tavsiyesini 12 Mayıs 1998'de duyurdu.", "css2"),
  q("trd010", "medium", "technology", "W3C'nin CSS2 duyurusuna göre öğelerin sayfada konumlandırılmasına hangi özellik yardımcı olur?",
    ["Positioning", "Cookies", "DNS", "HTTP caching"], "CSS2 duyurusu, sayfa düzeni için konumlandırma özelliklerini vurgular.", "css2"),
  q("trd011", "medium", "cinema_television", "1935 Oscar töreninde En İyi Film ödülünü hangi yapım kazandı?",
    ["It Happened One Night", "The Merry Widow", "Cleopatra", "The Thin Man"], "Sinema Akademisi'nin 1935 töreni kaydında En İyi Film It Happened One Night'tır.", "oscars1935"),
  q("trd012", "hard", "cinema_television", "It Happened One Night filmiyle 1935 Oscar'ında En İyi Yönetmen ödülünü kim aldı?",
    ["Frank Capra", "William Wyler", "John Ford", "George Cukor"], "Akademi'nin 1935 kayıtlarında yönetmen ödülü Frank Capra'ya verilmiştir.", "oscars1935"),
  q("trd013", "hard", "cinema_television", "1935 Oscar'ında It Happened One Night ile En İyi Erkek Oyuncu seçilen kişi kimdi?",
    ["Clark Gable", "James Cagney", "Fredric March", "Spencer Tracy"], "Akademi arşivinde 1935 oyuncu ödülünün sahibi Clark Gable'dır.", "oscars1935"),
  q("trd014", "hard", "cinema_television", "1935 Oscar'ında It Happened One Night ile En İyi Kadın Oyuncu seçilen kişi kimdi?",
    ["Claudette Colbert", "Greer Garson", "Katharine Hepburn", "Bette Davis"], "Akademi arşivi 1935 kadın oyuncu ödülünü Claudette Colbert'e yazar.", "oscars1935"),
  q("trd015", "medium", "cinema_television", "1941 Oscar töreninde En İyi Film seçilen Alfred Hitchcock filmi hangisiydi?",
    ["Rebecca", "Suspicion", "Spellbound", "Notorious"], "Akademi'nin 1941 töreninde En İyi Film ödülü Rebecca'ya verildi.", "oscars1941"),
  q("trd016", "medium", "cinema_television", "1943 Oscar töreninde En İyi Film seçilen yapım hangisiydi?",
    ["Mrs. Miniver", "Casablanca", "Yankee Doodle Dandy", "The Magnificent Ambersons"], "Akademi kayıtlarında 1943 En İyi Film ödülü Mrs. Miniver'a aittir.", "oscars1943"),
  q("trd017", "hard", "cinema_television", "Yankee Doodle Dandy ile 1943 Oscar'ında En İyi Erkek Oyuncu kim seçildi?",
    ["James Cagney", "Clark Gable", "Humphrey Bogart", "Gary Cooper"], "Akademi 1943 töreninde James Cagney'yi bu rolle ödüllendirdi.", "oscars1943"),
  q("trd018", "medium", "language_literature", "TDK'ye göre aşağıdakilerden hangisi kalın ünlülerden biridir?",
    ["ı", "e", "i", "ö"], "TDK, a, ı, o ve u harflerini kalın ünlü olarak sınıflandırır.", "vowels"),
  q("trd019", "medium", "language_literature", "TDK'nin sınıflandırmasına göre hangi ünlü hem ince hem yuvarlaktır?",
    ["ö", "a", "ı", "e"], "Ö, ince (e, i, ö, ü) ve yuvarlak (o, ö, u, ü) ünlüler arasında yer alır.", "vowels"),
  q("trd020", "medium", "language_literature", "'Burun' sözcüğüne iyelik eki geldiğinde TDK'ye göre hangi biçim oluşur?",
    ["Burnu", "Burunu", "Burnunu", "Bürünü"], "TDK'nin ünlü düşmesi örneklerinde burun sözcüğü ek alınca burnu biçimine dönüşür.", "vowelDrop"),
];

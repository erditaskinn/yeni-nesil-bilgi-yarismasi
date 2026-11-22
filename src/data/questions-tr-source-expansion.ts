import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  oceanDepth: "https://oceanservice.noaa.gov/facts/oceandepth.html",
  deadSea: "https://eros.usgs.gov/earthshots/dead-sea-israel-jordan-west-bank",
  winterGames: "https://library.olympics.com/Default/basicfilesdownload.ashx?itemId=1002",
  cssOne: "https://www.w3.org/press-releases/1996/css1-rec/",
  htmlThree: "https://www.w3.org/press-releases/1997/html32-rec/",
  firstOscars: "https://www.oscars.org/oscars/ceremonies/1929",
  alphabet: "https://yazim.tdk.gov.tr/content/01-ses-harf-ve-alfabe.html",
  vowels: "https://tdk.gov.tr/icerik/yazim-kurallari/unlulerin-nitelikleri/",
} as const;

function q(
  id: string,
  difficulty: Difficulty,
  category: Exclude<GameCategory, "mixed">,
  question: string,
  options: [string, string, string, string],
  explanation: string,
  source: keyof typeof sources,
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

// Turkish-only questions target previously empty category/difficulty combinations.
export const turkishSourceExpansion: readonly Question[] = [
  q("trc001", "expert", "geography", "NOAA'ya göre okyanusların en derin bölgesi Challenger Deep hangi çukurun güney ucundadır?",
    ["Mariana Çukuru", "Porto Riko Çukuru", "Java Çukuru", "Tonga Çukuru"],
    "NOAA, Challenger Deep'i batı Pasifik'teki Mariana Çukuru'nun güney ucunda konumlandırır.", "oceanDepth"),
  q("trc002", "expert", "geography", "USGS'ye göre yüzeyi deniz seviyesinin 400 metreden fazla altında olan Ölü Deniz hangi bakımdan Dünya'da en uç noktadır?",
    ["En alçak doğal kara veya su yüzeyi", "En derin okyanus noktası", "En yüksek tuzluluk oranına sahip okyanus", "En geniş kapalı göl"],
    "USGS, Ölü Deniz'in su yüzeyini Dünya'daki en alçak doğal kara veya su yüzeyi olarak tanımlar.", "deadSea"),
  q("trc003", "hard", "sports", "IOC arşivine göre 1924 Chamonix Kış Oyunları programında kaç spor dalı vardı?",
    ["6", "4", "9", "12"],
    "Uluslararası Olimpiyat Komitesi arşivinde Chamonix programı 6 spor dalı ve 16 etkinlik olarak kayıtlıdır.", "winterGames"),
  q("trc004", "expert", "sports", "IOC arşivine göre 1924 Chamonix Kış Oyunları'nda kaç ayrı yarışma etkinliği düzenlendi?",
    ["16", "6", "24", "32"],
    "Uluslararası Olimpiyat Komitesi arşivi 1924 Chamonix oyunlarında 16 ayrı etkinlik olduğunu belirtir.", "winterGames"),
  q("trc005", "hard", "technology", "W3C, CSS'nin ilk düzeyini (CSS1) hangi yılda resmi tavsiye olarak yayımladı?",
    ["1996", "1991", "2001", "2006"],
    "W3C, CSS1 tavsiye kararını 17 Aralık 1996'da yayımladı.", "cssOne"),
  q("trc006", "expert", "technology", "W3C'nin 1997'de yayımladığı HTML 3.2 tavsiyesi aşağıdaki hangi özelliği yaygın kullanılan eklemeler arasında sayar?",
    ["Tablolar", "WebGL sahneleri", "Service worker", "CSS Grid"],
    "W3C'nin HTML 3.2 duyurusu tabloları, applet'leri ve görseller etrafında metin akışını yeni yaygın özellikler arasında sayar.", "htmlThree"),
  q("trc007", "hard", "cinema_television", "Sinema Akademisi kayıtlarına göre ilk Oscar töreninde Üstün Film ödülünü hangi yapım kazandı?",
    ["Wings", "Sunrise", "The Jazz Singer", "The Circus"],
    "1929'daki ilk törende Üstün Film ödülü Wings'e verildi; Sunrise ayrı bir Sanatsal Film ödülü aldı.", "firstOscars"),
  q("trc008", "expert", "cinema_television", "1929'daki ilk Oscar töreninde ayrı bir kategori olan 'Sanatsal Film' ödülünü hangi yapım kazandı?",
    ["Sunrise", "Wings", "The Crowd", "Chang"],
    "Sinema Akademisi arşivinde Unique and Artistic Picture ödülünün sahibi Sunrise olarak kayıtlıdır.", "firstOscars"),
  q("trc009", "easy", "language_literature", "Türk Dil Kurumuna göre Türk alfabesinde kaç harf vardır?",
    ["29", "26", "30", "32"],
    "TDK, Türk alfabesinde 29 harf bulunduğunu belirtir.", "alphabet"),
  q("trc010", "easy", "language_literature", "Türk Dil Kurumuna göre Türkçede kaç ünlü harf vardır?",
    ["8", "6", "10", "12"],
    "TDK, a, e, ı, i, o, ö, u ve ü olmak üzere sekiz ünlü sayar.", "vowels"),
];

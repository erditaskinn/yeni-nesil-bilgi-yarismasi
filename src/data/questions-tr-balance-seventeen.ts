import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  badminton: "https://system.bwfbadminton.com/documents/folder_1_81/Statutes/CHAPTER-4---RULES-OF-THE-GAME/SECTION%204.1-%20Laws%20of%20Badminton.pdf",
  tableTennis: "https://www.ittf.com/2021/07/22/table-tennis-101/",
  cycling: "https://www.uci.org/uci-the-federation/7xhBYbVFdymwzNedJF36Wx",
  track: "https://www.uci.org/article/what-is-track-cycling/6yFQsdYGiuw1bIWiLS6Hxq",
  bmx: "https://www.uci.org/article/what-is-bmx-racing/2B94rIBNgZIOMAqiFx9C3l",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trad001", "easy", "sports", "Badmintonda topun file üzerinden geçirildiği vuruş oyununu hangi araçla oynarsın?", ["Raket", "Sopa", "Eldiven", "Cirit"], "BWF kuralları badmintonun raketle oynandığını belirtir.", "badminton"],
  ["trad002", "medium", "sports", "BWF'nin standart badminton maçında kaç oyun kazanmak gerekir?", ["İki", "Bir", "Üç", "Dört"], "BWF, standart maçı üç oyunun en iyisi olarak tanımlar; iki oyun kazanmak yeterlidir.", "badminton"],
  ["trad003", "medium", "sports", "Badmintonda bir oyun normalde kaç sayıya oynanır?", ["21", "11", "15", "25"], "BWF standart kuralları oyun hedefini 21 sayı olarak verir.", "badminton"],
  ["trad004", "medium", "sports", "Badmintonda skor 20-20 olduğunda oyunu kazanmak için kaç sayı fark gerekir?", ["İki", "Bir", "Üç", "Dört"], "BWF, 20-20'den sonra iki sayılık fark şartı koyar.", "badminton"],
  ["trad005", "hard", "sports", "Badmintonda skor 29-29 olursa oyunu hangi sayı bitirir?", ["30. sayı", "31. sayı", "32. sayı", "35. sayı"], "BWF kurallarına göre 29-29'da 30. sayıyı alan oyun kazanır.", "badminton"],
  ["trad006", "medium", "sports", "Badmintonda servis atan ile karşılayan oyuncu başlangıçta hangi servis alanlarında durur?", ["Çapraz karşılıklı", "Aynı tarafta", "Yan yana", "Saha dışında"], "BWF, servis atan ile karşılayanın çapraz servis alanlarında durmasını ister.", "badminton"],
  ["trad007", "hard", "sports", "BWF'ye göre üçüncü badminton oyununda taraflar bir taraf ilk kez kaç sayıya ulaşınca yer değiştirir?", ["11", "5", "15", "21"], "BWF, üçüncü oyunda ilk 11 sayıya ulaşıldığında taraf değişimi öngörür.", "badminton"],
  ["trad008", "easy", "sports", "Masa tenisinde topa vurmak için hangi araç kullanılır?", ["Raket", "Cirit", "Golf sopası", "Yay"], "ITTF masa tenisini raketle oynanan masa oyunu olarak tanıtır.", "tableTennis"],
  ["trad009", "medium", "sports", "Masa tenisinde bir oyun normalde kaç sayıya oynanır?", ["11", "15", "21", "25"], "ITTF, masa tenisi oyunlarının 11 sayıya oynandığını belirtir.", "tableTennis"],
  ["trad010", "medium", "sports", "Masa tenisinde skor 10-10 olursa kazanmak için kaç sayı fark gerekir?", ["İki", "Bir", "Üç", "Dört"], "ITTF, 10-10'dan sonra iki sayılık fark gerektiğini açıklar.", "tableTennis"],
  ["trad011", "medium", "sports", "Masa tenisinde servis sırası normalde kaç sayıdan sonra değişir?", ["İki", "Bir", "Üç", "Beş"], "ITTF, normal akışta her iki sayıdan sonra servis sırasının değiştiğini belirtir.", "tableTennis"],
  ["trad012", "hard", "sports", "Masa tenisinde 10-10 eşitliğinden sonra servis sırası nasıl değişir?", ["Her sayıdan sonra", "İki sayıdan sonra", "Beş sayıdan sonra", "Artık değişmez"], "ITTF, 10-10 eşitliğinde servisin her sayıdan sonra değiştiğini belirtir.", "tableTennis"],
  ["trad013", "medium", "sports", "Olimpik masa tenisindeki karma çiftler takımında kaç kadın ve kaç erkek sporcu vardır?", ["Bir kadın ve bir erkek", "İki kadın", "İki erkek", "İki kadın ve iki erkek"], "ITTF, karma çiftleri bir kadın ve bir erkek oyuncudan oluşan ikili olarak tanımlar.", "tableTennis"],
  ["trad014", "easy", "sports", "Pist bisikleti yarışlarının yapıldığı özel alana ne denir?", ["Velodrom", "Stadyum havuzu", "Tenis kortu", "Kayak pisti"], "UCI, pist bisikleti yarışlarının velodromlarda yapıldığını açıklar.", "track"],
  ["trad015", "medium", "sports", "UCI'nin bisiklet branşlarından biri hangisidir?", ["Dağ bisikleti", "Buz hokeyi", "Su topu", "Hentbol"], "UCI, dağ bisikletini yönettiği bisiklet disiplinleri arasında listeler.", "cycling"],
  ["trad016", "easy", "sports", "BMX Racing yarışları hangi araçla yapılır?", ["Bisiklet", "Kayık", "Paten", "Motosiklet"], "UCI, BMX Racing'i bisiklet yarış disiplini olarak açıklar.", "bmx"],
  ["trad017", "hard", "sports", "UCI'ye göre BMX Racing bisikletlerinde hangi sistem bulunmaz?", ["Süspansiyon", "Pedal", "Gidon", "Tekerlek"], "UCI, BMX Racing bisikletlerinde süspansiyon sistemi olmadığını belirtir.", "bmx"],
  ["trad018", "medium", "sports", "UCI'nin pist bisikleti yarışları ile yol yarışları arasındaki temel ortam farkı hangisidir?", ["Pistte velodrom, yol yarışında açık yollar", "Pistte havuz, yolda buz", "Pistte kum, yolda su", "İkisinde de yalnız dağ yolu"], "UCI, pist yarışlarını velodromda, yol yarışlarını açık yollarda yapılan bisiklet dalları olarak anlatır.", "track"],
];

export const turkishBalanceSeventeen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

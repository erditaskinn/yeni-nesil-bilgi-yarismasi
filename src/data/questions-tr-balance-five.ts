import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  gallery: "https://www.nationalgallery.org.uk/about-us/press-and-media/press-releases-archive/the-national-gallery-s-top-20-most-viewed-paintings-online",
  temeraire: "https://www.nationalgallery.org.uk/paintings/joseph-mallord-william-turner-the-fighting-temeraire",
  sunflowers: "https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers",
  mondrian: "https://www.moma.org/collection/works/78682",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trr001", "medium", "arts_culture", "Arnolfini Portresi'nin ressamı kimdir?", ["Jan van Eyck", "Claude Monet", "Rembrandt", "Paul Cézanne"], "National Gallery, Arnolfini Portresi'ni Jan van Eyck'in eseri olarak listeler.", "gallery"],
  ["trr002", "medium", "arts_culture", "Elçiler (The Ambassadors) tablosunu kim yaptı?", ["Hans Holbein", "J. M. W. Turner", "Vincent van Gogh", "Georges Seurat"], "National Gallery, Elçiler'in ressamını Hans Holbein olarak kaydeder.", "gallery"],
  ["trr003", "medium", "arts_culture", "Savaşçı Temeraire (The Fighting Temeraire) hangi ressamın eseridir?", ["J. M. W. Turner", "John Constable", "William Hogarth", "Joshua Reynolds"], "National Gallery, Temeraire tablosunu Turner'ın eseri olarak listeler.", "temeraire"],
  ["trr004", "medium", "arts_culture", "Kayaların Bakiresi (The Virgin of the Rocks) hangi ressama aittir?", ["Leonardo da Vinci", "Sandro Botticelli", "Raffaello", "Tiziano"], "National Gallery, Kayaların Bakiresi'ni Leonardo da Vinci'nin yapıtı olarak listeler.", "gallery"],
  ["trr005", "medium", "arts_culture", "Yağmur, Buhar ve Hız tablosu hangi ressamındır?", ["J. M. W. Turner", "John Constable", "Georges Seurat", "Piet Mondrian"], "National Gallery, Rain, Steam, and Speed yapıtını Turner'a atfeder.", "gallery"],
  ["trr006", "medium", "arts_culture", "Saman Arabası (The Hay Wain) tablosunun ressamı kimdir?", ["John Constable", "J. M. W. Turner", "Hans Holbein", "Caravaggio"], "National Gallery, The Hay Wain'i John Constable'ın eseri olarak kaydeder.", "gallery"],
  ["trr007", "medium", "arts_culture", "Venüs ve Mars tablosu hangi Rönesans ressamına aittir?", ["Sandro Botticelli", "Leonardo da Vinci", "Michelangelo", "Titian"], "National Gallery, Venus and Mars'ın ressamını Botticelli olarak listeler.", "gallery"],
  ["trr008", "medium", "arts_culture", "Emmaus'ta Akşam Yemeği tablosunun ressamı kimdir?", ["Caravaggio", "Johannes Vermeer", "Claude Monet", "Piet Mondrian"], "National Gallery, The Supper at Emmaus'u Caravaggio'nun eseri olarak listeler.", "gallery"],
  ["trr009", "hard", "arts_culture", "Asnières'de Yıkananlar tablosunu kim yaptı?", ["Georges Seurat", "Claude Monet", "Edgar Degas", "Paul Gauguin"], "National Gallery, Bathers at Asnières'in ressamını Seurat olarak verir.", "gallery"],
  ["trr010", "hard", "arts_culture", "Bacchus ve Ariadne tablosunun ressamı kimdir?", ["Titian", "Botticelli", "Caravaggio", "Raffaello"], "National Gallery, Bacchus and Ariadne'yi Titian'ın eseri olarak listeler.", "gallery"],
  ["trr011", "hard", "arts_culture", "Bir Kuş Üzerinde Hava Pompası Deneyi tablosunu kim yaptı?", ["Joseph Wright of Derby", "John Constable", "William Hogarth", "J. M. W. Turner"], "National Gallery, An Experiment on a Bird in the Air Pump yapıtını Joseph Wright of Derby'ye atfeder.", "gallery"],
  ["trr012", "hard", "arts_culture", "San Romano Savaşı konulu National Gallery tablosu hangi ressama aittir?", ["Paolo Uccello", "Piero della Francesca", "Titian", "Giotto"], "National Gallery, San Romano Savaşı tablosunun ressamını Paolo Uccello olarak verir.", "gallery"],
  ["trr013", "hard", "arts_culture", "Sultan II. Mehmed'in 1480 tarihli portresini hangi ressam yaptı?", ["Gentile Bellini", "Tiziano", "Hans Holbein", "Jan van Eyck"], "National Gallery, Sultan Mehmet II portresini Gentile Bellini'nin eseri olarak listeler.", "gallery"],
  ["trr014", "hard", "arts_culture", "Rokeby Venüsü tablosu hangi İspanyol ressamın eseridir?", ["Diego Velázquez", "Francisco Goya", "Pablo Picasso", "El Greco"], "National Gallery, Rokeby Venus'ın ressamını Velázquez olarak kaydeder.", "gallery"],
  ["trr015", "hard", "arts_culture", "Sürpriz! (Surprised!) adlı orman sahnesi hangi ressamındır?", ["Henri Rousseau", "Claude Monet", "Paul Cézanne", "Vincent van Gogh"], "National Gallery, Surprised! yapıtını Henri Rousseau'ya atfeder.", "gallery"],
  ["trr016", "hard", "arts_culture", "Marriage A-la-Mode dizisi hangi ressamın eseridir?", ["William Hogarth", "John Constable", "Thomas Gainsborough", "J. M. W. Turner"], "National Gallery, Marriage A-la-Mode dizisini Hogarth'ın eseri olarak listeler.", "gallery"],
  ["trr017", "medium", "arts_culture", "Turner'ın Savaşçı Temeraire tablosunda eski savaş gemisi son yolculuğunda nereye götürülür?", ["Sökülmeye", "Yeni sefere", "Müzede sergilenmeye", "Yarışa katılmaya"], "National Gallery, geminin sökülmek üzere çekildiğini anlatır.", "temeraire"],
  ["trr018", "medium", "arts_culture", "Savaşçı Temeraire tablosundaki yaşlı gemiyi çeken araç nedir?", ["Buharlı römorkör", "At arabası", "Balon", "Tren"], "National Gallery, Temeraire'in buharlı römorkörle çekildiğini açıklar.", "temeraire"],
  ["trr019", "hard", "arts_culture", "Van Gogh, Ayçiçekleri tablolarını Arles'deki evini hangi sanatçının ziyareti için süslemek üzere yaptı?", ["Paul Gauguin", "Claude Monet", "Pablo Picasso", "Henri Matisse"], "National Gallery, Van Gogh'un Gauguin'in ziyareti öncesinde bu diziyi hazırladığını belirtir.", "sunflowers"],
  ["trr020", "expert", "arts_culture", "Mondrian'ın Broadway Boogie Woogie tablosunda önceki ızgara resimlerinden farklı olarak hangi renkli öğe çıkar?", ["Siyah şeritler", "Mavi kareler", "Sarı çizgiler", "Beyaz zemin"], "MoMA, Broadway Boogie Woogie'de Mondrian'ın siyahı bırakıp çok renkli şeritlere geçtiğini açıklar.", "mondrian"],
];

export const turkishBalanceFive: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

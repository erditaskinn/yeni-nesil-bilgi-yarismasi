import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  unicef: "https://www.unicef.org/what-we-do",
  upu: "https://www.upu.int/en/Universal%20Postal%20Union",
  iso: "https://www.iso.org/about",
  isoStandards: "https://www.iso.org/standards.html",
  heritage: "https://ich.unesco.org/en/faq-00021",
  heritageDomains: "https://ich.unesco.org/en/intangible-heritage-domains-00052",
  si: "https://www.bipm.org/en/measurement-units/si-base-units",
  prefixes: "https://www.bipm.org/en/measurement-units/si-prefixes",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trv001", "easy", "general_knowledge", "UNICEF çalışmalarında öncelikle kimlerin haklarını korur?", ["Çocukların", "Sadece sporcuların", "Sadece sanatçıların", "Sadece şirketlerin"], "UNICEF, çocuk haklarını korumak için çalışan BM kuruluşudur.", "unicef"],
  ["trv002", "easy", "general_knowledge", "UNICEF'in desteklediği temel hizmetlerden biri hangisidir?", ["Eğitim", "Silah ticareti", "Borsa aracılığı", "Film dağıtımı"], "UNICEF, eğitim, sağlık ve beslenme hizmetlerini desteklediğini belirtir.", "unicef"],
  ["trv003", "medium", "general_knowledge", "UNICEF'in acil durumlarda yaptığı çalışmalardan biri hangisidir?", ["Çocuklara yaşamsal yardım ulaştırmak", "Seçim sonuçlarını açıklamak", "Döviz kuru belirlemek", "Spor ligi yönetmek"], "UNICEF, kriz öncesi, sırası ve sonrasında hayat kurtaran yardım sağladığını açıklar.", "unicef"],
  ["trv004", "medium", "general_knowledge", "UNICEF'in çocuklara yönelik sağlık çalışmalarından biri hangisidir?", ["Aşı desteği", "Yarış arabası tasarımı", "Pasaport basımı", "Maden ruhsatı verme"], "UNICEF, sağlık ve aşılama alanlarını başlıca çalışmalarından sayar.", "unicef"],
  ["trv005", "easy", "general_knowledge", "Evrensel Posta Birliği (UPU) en çok hangi hizmetin ülkeler arasında işlemesiyle ilgilenir?", ["Posta", "Havayolu bagajı", "Sinema bileti", "Futbol transferi"], "UPU, uluslararası posta alışverişinin kurallarını belirler.", "upu"],
  ["trv006", "medium", "general_knowledge", "Evrensel Posta Birliği'nin merkezi hangi şehirdedir?", ["Bern", "Roma", "Madrid", "Tokyo"], "UPU, merkezinin İsviçre'nin başkenti Bern'de olduğunu belirtir.", "upu"],
  ["trv007", "medium", "general_knowledge", "Evrensel Posta Birliği hangi yılda kurulmuştur?", ["1874", "1914", "1945", "2000"], "UPU, kuruluş yılını 1874 olarak verir.", "upu"],
  ["trv008", "hard", "general_knowledge", "Evrensel Posta Birliği'nin en üst karar organı hangisidir?", ["Kongre", "Güvenlik Konseyi", "Genel Kurul", "Divan"], "UPU, kendi Kongresi'ni birliğin en üst organı olarak tanımlar.", "upu"],
  ["trv009", "easy", "general_knowledge", "ISO'nun temel çalışma alanı hangisidir?", ["Uluslararası standartlar", "Film ödülleri", "Spor karşılaşmaları", "Hava tahmini"], "ISO, uluslararası standartlar geliştiren kuruluştur.", "iso"],
  ["trv010", "medium", "general_knowledge", "ISO kısa adı hangi Yunanca sözcükten esinlenmiştir?", ["Isos", "Chronos", "Logos", "Kosmos"], "ISO, kısa adının 'eşit' anlamındaki Yunanca isos sözcüğünden esinlendiğini açıklar.", "iso"],
  ["trv011", "medium", "general_knowledge", "ISO 9001 standardı en çok hangi yönetim alanıyla ilişkilidir?", ["Kalite yönetimi", "Futbol kuralları", "Film kurgusu", "Uzay uçuşu"], "ISO, ISO 9001'i kalite yönetimi standardı olarak tanımlar.", "isoStandards"],
  ["trv012", "medium", "general_knowledge", "ISO'nun üyeleri çoğunlukla hangi kurumlardır?", ["Ulusal standart kuruluşları", "Futbol kulüpleri", "Film stüdyoları", "Hastaneler"], "ISO, üyelerinin ülkelerin standart kuruluşları olduğunu açıklar.", "iso"],
  ["trv013", "easy", "general_knowledge", "UNESCO'ya göre bir binanın korunması hangi miras türüne örnektir?", ["Somut miras", "Sözlü anlatı", "Yaşayan gelenek", "Performans sanatı"], "UNESCO, anıtlar ile kültürel ve doğal alanları somut miras kapsamında tanımlar.", "heritage"],
  ["trv014", "medium", "general_knowledge", "UNESCO'nun somut olmayan miras yaklaşımı özellikle neyin yaşatılmasına odaklanır?", ["Toplulukların aktardığı geleneklerin", "Binaların dış cephesinin", "Jeolojik kayaçların", "Uydu yörüngelerinin"], "UNESCO, somut olmayan mirası topluluklarca kuşaktan kuşağa aktarılan uygulamalarla ilişkilendirir.", "heritage"],
  ["trv015", "medium", "general_knowledge", "UNESCO'nun somut olmayan miras alanlarından biri hangisidir?", ["Geleneksel zanaatkârlık", "Gökdelen mühendisliği", "Fosil kayaları", "Uydu yörüngeleri"], "UNESCO, geleneksel zanaatkârlık bilgi ve becerilerini somut olmayan miras alanları arasında sayar.", "heritageDomains"],
  ["trv016", "medium", "general_knowledge", "SI birim sisteminde kaç temel birim vardır?", ["Yedi", "Üç", "On", "On iki"], "BIPM, SI sisteminde yedi temel birim listeler.", "si"],
  ["trv017", "medium", "general_knowledge", "SI'da 'desi' öneki bir birimin kaçta birini gösterir?", ["Onda birini", "Yüzde birini", "Binde birini", "Milyonda birini"], "BIPM, deci önekini 10 üzeri eksi 1 olarak listeler.", "prefixes"],
  ["trv018", "medium", "general_knowledge", "SI'da 'hekto' öneki bir birimin kaç katını gösterir?", ["Yüz katını", "On katını", "Bin katını", "Milyon katını"], "BIPM, hecto önekini 10 üzeri 2 olarak listeler.", "prefixes"],
];

export const turkishBalanceNine: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

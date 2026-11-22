import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  sagarmatha: "https://whc.unesco.org/en/list/120/",
  plitvice: "https://whc.unesco.org/en/list/98",
  komodo: "https://whc.unesco.org/en/list/609",
  wadden: "https://whc.unesco.org/en/list/1314/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trx001", "easy", "geography", "Everest Dağı'nın bulunduğu Sagarmatha Milli Parkı hangi ülkededir?", ["Nepal", "Bhutan", "Pakistan", "Moğolistan"], "UNESCO, Sagarmatha Milli Parkı'nı Nepal'de listeler.", "sagarmatha"],
  ["trx002", "medium", "geography", "Everest Dağı UNESCO'nun hangi milli park alanı içindedir?", ["Sagarmatha", "Komodo", "Plitvice", "Serengeti"], "UNESCO, Everest'i Sagarmatha Milli Parkı'nın parçası olarak tanımlar.", "sagarmatha"],
  ["trx003", "medium", "geography", "UNESCO'nun Sagarmatha Milli Parkı'nda öne çıkardığı doğal oluşumlardan biri hangisidir?", ["Buzullar", "Mercan resifleri", "Mangrovlar", "Çöl kumulları"], "UNESCO, parkın dağlar, buzullar ve derin vadiler barındırdığını belirtir.", "sagarmatha"],
  ["trx004", "hard", "geography", "Sagarmatha Milli Parkı Nepal'in hangi bölgesindedir?", ["Solu-Khumbu", "Pencap", "Bengal", "Keşmir"], "UNESCO, milli parkı Nepal'in Solu-Khumbu bölgesinde konumlandırır.", "sagarmatha"],
  ["trx005", "easy", "geography", "Plitvice Gölleri Milli Parkı hangi ülkededir?", ["Hırvatistan", "İsviçre", "Avusturya", "Norveç"], "UNESCO, Plitvice Gölleri Milli Parkı'nı Hırvatistan'da listeler.", "plitvice"],
  ["trx006", "medium", "geography", "Plitvice Gölleri doğal olarak birbirine en çok neyle bağlanır?", ["Şelaleler ve su yollarıyla", "Çöl kumullarıyla", "Mercan resifleriyle", "Lav akıntılarıyla"], "UNESCO, göllerin şelaleler ve su yollarıyla birbirine bağlandığını anlatır.", "plitvice"],
  ["trx007", "hard", "geography", "Plitvice Gölleri'ndeki doğal setlerin oluşmasında hangi maddenin çökelmesi rol oynar?", ["Kalsiyum karbonat", "Sodyum klorür", "Demir cevheri", "Petrol"], "UNESCO, göllerde kalsiyum karbonat çökelmesiyle tüf setlerinin oluştuğunu belirtir.", "plitvice"],
  ["trx008", "medium", "geography", "Plitvice Gölleri Milli Parkı hangi dağ kuşağının alçak kesimlerindedir?", ["Dinar Alpleri", "And Dağları", "Himalayalar", "Atlas Dağları"], "UNESCO, Plitvice'nin Dinar Dağları'nın alçak yükseltilerinde olduğunu belirtir.", "plitvice"],
  ["trx009", "easy", "geography", "Komodo Milli Parkı hangi ülkededir?", ["Endonezya", "Filipinler", "Avustralya", "Malezya"], "UNESCO, Komodo Milli Parkı'nı Endonezya'da listeler.", "komodo"],
  ["trx010", "medium", "geography", "Komodo Milli Parkı'nın adaları hangi kökenden gelir?", ["Volkanik", "Buzul", "Mercan", "Yapay dolgu"], "UNESCO, parkın büyük ve küçük adalarının volkanik kökenli olduğunu belirtir.", "komodo"],
  ["trx011", "medium", "geography", "Komodo Milli Parkı hangi iki ada arasında konumlanır?", ["Sumbawa ve Flores", "Java ve Sumatra", "Bali ve Lombok", "Borneo ve Sulawesi"], "UNESCO, parkın Sumbawa ile Flores arasında bulunduğunu açıklar.", "komodo"],
  ["trx012", "hard", "geography", "Komodo Milli Parkı'nın üç ana adasından biri hangisidir?", ["Rinca", "Java", "Borneo", "Sumatra"], "UNESCO, Rinca, Komodo ve Padar'ı parkın üç büyük adası olarak sayar.", "komodo"],
  ["trx013", "easy", "geography", "Wadden Denizi UNESCO alanı hangi kıtanın kıyısındadır?", ["Avrupa", "Afrika", "Asya", "Güney Amerika"], "UNESCO, Wadden Denizi'ni Hollanda, Almanya ve Danimarka kıyılarında listeler.", "wadden"],
  ["trx014", "medium", "geography", "Wadden Denizi hangi üç ülkenin kıyılarına uzanır?", ["Hollanda, Almanya, Danimarka", "İspanya, Portekiz, Fransa", "İtalya, Yunanistan, Türkiye", "İsveç, Finlandiya, Norveç"], "UNESCO, Wadden Denizi alanını Hollanda, Almanya ve Danimarka arasında listeler.", "wadden"],
  ["trx015", "medium", "geography", "Wadden Denizi'nde gelgitler özellikle hangi geniş kıyı alanlarını açığa çıkarır?", ["Kum ve çamur düzlüklerini", "Buzul kubbelerini", "Lav ovalarını", "Mercan dağlarını"], "UNESCO, Wadden Denizi'ni gelgit etkisindeki kum ve çamur düzlükleriyle tanımlar.", "wadden"],
  ["trx016", "hard", "geography", "UNESCO'nun Wadden Denizi'nde yaşadığını belirttiği deniz memelisi hangisidir?", ["Liman foku", "Mavi balina", "Deniz aygırı", "Dugong"], "UNESCO, Wadden Denizi canlıları arasında liman fokunu sayar.", "wadden"],
  ["trx017", "medium", "geography", "Wadden Denizi UNESCO alanında hangi kıyı bitki örtüsü bulunur?", ["Tuzcul bataklıklar", "Tropikal palmiyeler", "Alp ormanları", "Çöl kaktüsleri"], "UNESCO, Wadden Denizi kıyı habitatları arasında tuzcul bataklıkları sayar.", "wadden"],
];

export const turkishBalanceEleven: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));

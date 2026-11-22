import { levelBalanceQuestions as make } from "./level-balance-format";
export const levelCinema = [
  ...make("tlcne", "cinema_television", "easy", "https://www.pixar.com/finding-nemo", [
    ["Kayıp Balık Nemo'daki Nemo hangi tür hayvandır?", ["Balık", "Kuş", "Kedi", "At"], "Nemo, bir palyaço balığıdır."],
    ["Kayıp Balık Nemo'da Marlin kaybolan kimin peşine düşer?", ["Oğlunun", "Öğretmeninin", "Patronunun", "Dedesinin"], "Marlin, oğlu Nemo'yu bulmak için yolculuğa çıkar."],
  ]),
  ...make("tlcre", "cinema_television", "easy", "https://www.pixar.com/ratatouille", [
    ["Ratatuy filmindeki Remy hangi hayvandır?", ["Fare", "Köpek", "Tavşan", "Kaplumbağa"], "Remy, yemek yapmayı seven bir faredir."],
    ["Ratatuy filminde Remy'nin hayalini kurduğu meslek hangisidir?", ["Aşçılık", "Pilotluk", "Doktorluk", "Kaptanlık"], "Remy büyük bir aşçı olmayı hayal eder."],
  ]),
  ...make("tlcae", "cinema_television", "easy", "https://www.pixar.com/cars", [
    ["Arabalar filmindeki Şimşek McQueen hangi araçtır?", ["Yarış arabası", "Uçak", "Tren", "Gemi"], "Şimşek McQueen, şampiyon olmak isteyen bir yarış arabasıdır."],
    ["Arabalar filmindeki yarışlar ağırlıklı olarak hangi araçlarla yapılır?", ["Otomobillerle", "Yelkenlilerle", "Bisikletlerle", "Helikopterlerle"], "Filmin merkezinde otomobil yarışları ve yarış arabaları bulunur."],
  ]),
  ...make("tlcie", "cinema_television", "easy", "https://www.pixar.com/inside-out", [
    ["Ters Yüz filminde Neşe ve Üzüntü gibi karakterler neyi temsil eder?", ["Duyguları", "Gezegenleri", "Mevsimleri", "Sayıları"], "Film, Riley'nin zihnindeki duyguları karakterler olarak gösterir."],
    ["Ters Yüz'de duyguların yönettiği Riley kimdir?", ["Bir çocuk", "Bir uzay gemisi", "Bir yarış arabası", "Bir robot köpek"], "Riley, yeni bir şehre taşınmaya uyum sağlamaya çalışan bir çocuktur."],
  ]),
  ...make("tlcme", "cinema_television", "easy", "https://www.pixar.com/monsters-inc", [
    ["Sevimli Canavarlar'ın Sulley ve Mike karakterleri hangi gruptandır?", ["Canavarlar", "Balıklar", "Robotlar", "Oyuncak arabalar"], "Sulley ve Mike, canavarlar dünyasında çalışan iki arkadaştır."],
    ["Sevimli Canavarlar'da canavarların dünyasına yanlışlıkla giren küçük kız hangi türdendir?", ["İnsan", "Robot", "Ejderha", "Balık"], "Sulley'nin dünyasına küçük bir insan kız girer."],
  ]),
  ...make("tlcoe", "cinema_television", "easy", "https://www.pixar.com/coco", [
    ["Coco filminde Miguel'in tutkusu hangi sanat dalıdır?", ["Müzik", "Heykel", "Mimarlık", "Fotoğraf"], "Miguel büyük bir müzisyen olmayı hayal eder."],
    ["Coco filminde Miguel'in geçmişini araştırdığı kişiler kimlerdir?", ["Ailesi ve ataları", "Uzaylılar", "Kutup kâşifleri", "Deniz korsanları"], "Miguel atalarının dünyasına giderek aile hikâyesinin sırlarını öğrenir."],
  ]),
  ...make("tlcwe", "cinema_television", "easy", "https://www.pixar.com/wall-e", [
    ["WALL-E filminin başkahramanı hangi tür varlıktır?", ["Robot", "Kedi", "Balık", "Dinozor"], "WALL-E, Dünya'da çalışan bir temizlik robotudur."],
    ["WALL-E Dünya'da hangi işi yapar?", ["Çöpleri toplar ve sıkıştırır", "Yarış arabası sürer", "Denizde balık avlar", "Okulda ders anlatır"], "WALL-E gezegendeki çöpleri küp biçiminde sıkıştırarak temizler."],
  ]),
  ...make("tlcue", "cinema_television", "easy", "https://www.pixar.com/upfilm", [
    ["Yukarı Bak filminde Carl evini neyle havalandırır?", ["Balonlarla", "Yelkenlerle", "Bisiklet pedallarıyla", "Deniz motoruyla"], "Carl evinin çatısına binlerce balon bağlar."],
    ["Yukarı Bak filminde uçan yapı hangisidir?", ["Carl'ın evi", "Bir okul otobüsü", "Bir deniz feneri", "Bir tren istasyonu"], "Carl macerasına havalanan eviyle çıkar."],
  ]),
  ...make("tlc55", "cinema_television", "expert", "https://www.oscars.org/oscars/ceremonies/1955", [
    ["1955 Oscar töreninde On the Waterfront'un kurgu ödülünü kim aldı?", ["Gene Milford", "Ralph E. Winters", "Elmo Williams", "William A. Lyon"], "Akademi, kurgu kazananı olarak Gene Milford'u kaydeder."],
    ["1955 Oscar'larında On the Waterfront'un siyah-beyaz görüntü yönetimi ödülü kime verildi?", ["Boris Kaufman", "Charles Lang", "John Seitz", "Milton Krasner"], "Boris Kaufman bu filmle siyah-beyaz görüntü yönetimi ödülünü aldı."],
    ["1955 Oscar'larında On the Waterfront'un siyah-beyaz sanat yönetimi kazananı kimdi?", ["Richard Day", "Hal Pereira", "Walter Tyler", "Max Ophuls"], "Akademi sanat yönetimi kazananı olarak Richard Day'i listeler."],
    ["1955'te Sabrina ile siyah-beyaz kostüm tasarımı Oscar'ını kim aldı?", ["Edith Head", "Irene Sharaff", "Jean Louis", "Helen Rose"], "Edith Head, Sabrina'nın kostümleriyle ödül aldı."],
    ["1955 Oscar'larında Seven Brides for Seven Brothers'ın müzik düzenleme ödülünü hangi ikili aldı?", ["Adolph Deutsch ve Saul Chaplin", "Alfred Newman ve Lionel Newman", "Jule Styne ve Sammy Cahn", "Richard Rodgers ve Oscar Hammerstein II"], "Akademi bu daldaki kazananları Adolph Deutsch ve Saul Chaplin olarak kaydeder."],
    ["1955 Oscar'larında Three Coins in the Fountain'ın renkli görüntü yönetimi ödülünü kim aldı?", ["Milton Krasner", "Robert Burks", "George Folsey", "William V. Skall"], "Milton Krasner bu filmle renkli görüntü yönetimi ödülünü aldı."],
    ["1955 Oscar'larında tek makaralık kısa film dalını hangi yapım kazandı?", ["This Mechanical Age", "The Strauss Fantasy", "Siam", "Sandy Claws"], "This Mechanical Age, Robert Youngson adına tek makaralık kısa film ödülünü kazandı."],
    ["1955 Oscar'larında iki makaralık kısa film dalını hangi yapım kazandı?", ["A Time Out of War", "Thursday's Children", "Jet Carrier", "The Stratford Adventure"], "A Time Out of War bu dalda Denis ve Terry Sanders adına kazandı."],
  ]),
  ...make("tlc65", "cinema_television", "expert", "https://www.oscars.org/oscars/ceremonies/1965", [
    ["1965 Oscar'larında Mary Poppins'in kurgu ödülünü kim aldı?", ["Cotton Warburton", "Anne Coates", "William Ziegler", "Michael Luciano"], "Cotton Warburton kurgu dalında Mary Poppins ile kazandı."],
    ["1965 Oscar'larında My Fair Lady'nin renkli görüntü yönetimi ödülünü kim kazandı?", ["Harry Stradling", "Edward Colman", "Geoffrey Unsworth", "Milton Krasner"], "Akademi kazananı Harry Stradling olarak kaydeder."],
    ["1965'te My Fair Lady ile renkli kostüm tasarımı Oscar'ını kim aldı?", ["Cecil Beaton", "Tony Walton", "Dorothy Jeakins", "Margaret Furse"], "Cecil Beaton bu filmdeki kostüm tasarımıyla kazandı."],
    ["1965 Oscar'larında The Night of the Iguana'nın siyah-beyaz kostüm ödülü kime verildi?", ["Dorothy Jeakins", "Edith Head", "Irene Sharaff", "Norma Koch"], "Siyah-beyaz kostüm tasarımı kazananı Dorothy Jeakins'tir."],
    ["1965 Oscar'larında My Fair Lady'nin müzik uyarlaması ödülünü kim aldı?", ["Andre Previn", "Irwin Kostal", "Nelson Riddle", "Dimitri Tiomkin"], "Akademi uyarlama müzik dalında Andre Previn'i kazanan olarak listeler."],
    ["1965 Oscar'larında kısa belgesel ödülünü hangi yapım kazandı?", ["Nine from Little Rock", "Kenojuak", "Over There, 1914-18", "The Legend of Jimmy Blue Eyes"], "Charles Guggenheim'ın Nine from Little Rock filmi kısa belgesel dalını kazandı."],
    ["1965'te kısa çizgi film Oscar'ını kazanan The Pink Phink'in yapımcı ikilisi hangisiydi?", ["David H. DePatie ve Friz Freleng", "Walt Disney ve Bill Walsh", "William Hanna ve Joseph Barbera", "Chuck Jones ve Mel Blanc"], "Akademi The Pink Phink için David H. DePatie ve Friz Freleng'i listeler."],
    ["1965 Oscar'larında Mary Poppins'in görsel efekt ödülünü hangi üçlü aldı?", ["Peter Ellenshaw, Eustace Lycett ve Hamilton Luske", "Dennis Muren, Phil Tippett ve Richard Edlund", "Frank Brendel, Glen Robinson ve Albert Whitlock", "John Stears, Grant McCune ve Robert Blalack"], "Mary Poppins'in ödülü Ellenshaw, Lycett ve Luske'ye verildi."],
  ]),
  ...make("tlc75", "cinema_television", "expert", "https://www.oscars.org/oscars/ceremonies/1975", [
    ["1975'te The Great Gatsby ile kostüm tasarımı Oscar'ını kim kazandı?", ["Theoni V. Aldredge", "Theadora Van Runkle", "Tony Walton", "Anthea Sylbert"], "1974 yapımı filmin 1975 kostüm ödülü Theoni V. Aldredge'e verildi."],
    ["1975 Oscar'larında The Great Gatsby'nin müzik uyarlaması ödülünü kim aldı?", ["Nelson Riddle", "John Williams", "Alex North", "Jerry Goldsmith"], "Nelson Riddle, The Great Gatsby için müzik uyarlamasıyla ödül aldı."],
    ["1975'te The Godfather Part II'nin özgün dramatik müzik Oscar'ını hangi ikili kazandı?", ["Nino Rota ve Carmine Coppola", "John Williams ve Jerry Goldsmith", "Nelson Riddle ve Alex North", "Elmer Bernstein ve Don Black"], "Akademi Nino Rota ve Carmine Coppola'yı birlikte listeler."],
    ["1975 Oscar'larında The Godfather Part II'nin sanat yönetimi ve dekor ödülündeki üçlü hangisiydi?", ["Dean Tavoularis, Angelo Graham ve George R. Nelson", "Richard Sylbert, Stewart Campbell ve Ruby Levitt", "William Creber, Ward Preston ve Raphael Bretton", "Alexander Golitzen, Preston Ames ve Frank McKelvy"], "Kazanan sanat yönetimi ve dekor ekibi Tavoularis, Graham ve Nelson'dur."],
    ["1975 Oscar'larında Earthquake filminin ses ödülünü hangi ikili aldı?", ["Ronald Pierce ve Melvin Metcalfe Sr.", "Walter Murch ve Arthur Rochester", "Bud Grenzbach ve Larry Jost", "Robert Knudson ve Robert Glass"], "Earthquake'in ses ödülü Ronald Pierce ve Melvin Metcalfe Sr.'a verildi."],
    ["1975 Oscar'larında animasyon kısa film ödülünü hangi yapım kazandı?", ["Closed Mondays", "Hunger", "The Family That Dwelt Apart", "The Concert"], "Will Vinton ve Bob Gardiner'ın Closed Mondays filmi kazandı."],
    ["1975 Oscar'larında kısa belgesel ödülünü hangi yapım kazandı?", ["Don't", "Exploratorium", "John Muir's High Sierra", "Naked Yoga"], "Robin Lehman'ın Don't adlı yapımı kısa belgesel ödülünü kazandı."],
    ["1975 Oscar'larında uzun metraj belgesel Hearts and Minds'ın ödül alan yapımcıları kimdi?", ["Peter Davis ve Bert Schneider", "Francis Thompson ve Alexander Hammid", "David Wolper ve Jack Haley Jr.", "Robert Epstein ve Richard Schmiechen"], "Akademi Hearts and Minds için Peter Davis ve Bert Schneider'i listeler."],
  ]),
  ...make("tlc85", "cinema_television", "expert", "https://www.oscars.org/oscars/ceremonies/1985", [
    ["1985 Oscar'larında The Killing Fields'ın kurgu ödülünü kim aldı?", ["Jim Clark", "Barry Malkin", "Donn Cambern", "Michael Chandler"], "Jim Clark, The Killing Fields ile kurgu ödülünü kazandı."],
    ["1985'te The Killing Fields ile görüntü yönetimi Oscar'ını kim kazandı?", ["Chris Menges", "Miroslav Ondricek", "Ernest Day", "Vilmos Zsigmond"], "Chris Menges bu filmin görüntü yönetimiyle ödül aldı."],
    ["1985 Oscar'larında Amadeus'un kostüm tasarımı ödülünü kim aldı?", ["Theodor Pistek", "Jenny Beavan", "John Bright", "Judy Moorcroft"], "Theodor Pistek, Amadeus'un kostümleriyle kazandı."],
    ["1985 Oscar'larında Amadeus'un makyaj ödülünü hangi ikili aldı?", ["Paul LeBlanc ve Dick Smith", "Rick Baker ve Dave Elsey", "Michael Westmore ve Zoltan Elek", "Stan Winston ve Ve Neill"], "Amadeus'un makyaj ödülü Paul LeBlanc ve Dick Smith'e verildi."],
    ["1985 Oscar'larında The River için özel ses efekti kurgusu ödülünü kim aldı?", ["Kay Rose", "Cecelia Hall", "Gloria Borders", "Dody Dorn"], "Kay Rose, The River ile özel başarı ödülünü aldı."],
    ["1985'te Amadeus'un uyarlama senaryo Oscar'ını kim kazandı?", ["Peter Shaffer", "Bruce Robinson", "David Lean", "Charles Fuller"], "Peter Shaffer kendi oyunundan uyarladığı senaryoyla kazandı."],
    ["1985 Oscar'larında kısa animasyon Charade için ödül alan yapımcı kimdi?", ["Jon Minnis", "Michael Sporn", "Morton Schindel", "Will Vinton"], "Charade, Jon Minnis adına kısa animasyon ödülünü aldı."],
    ["1985'te Amadeus'un sanat yönetimi ve dekor Oscar'ını hangi ikili aldı?", ["Patrizia von Brandenstein ve Karel Cerny", "Richard Sylbert ve George Gaines", "John Box ve Hugh Scaife", "Albert Brenner ve Rick Simpson"], "Akademi bu dalda Patrizia von Brandenstein ve Karel Cerny'yi listeler."],
  ]),
];

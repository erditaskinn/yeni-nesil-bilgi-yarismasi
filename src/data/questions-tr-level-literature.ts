import { levelBalanceQuestions as make } from "./level-balance-format";
export const levelLiterature = [
  ...make("tlle", "language_literature", "easy", "https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/", [
    ["'Eyvah, geç kaldım' gibi güçlü duygu bildiren bir cümlenin sonuna hangi işaret uygundur?", ["Ünlem", "Virgül", "Kesme", "Eğik çizgi"], "Sevinç, korku ve şaşma gibi duyguları anlatan cümlelerde ünlem kullanılır."],
    ["'Elma, armut, muz' sıralamasında sözcükleri ayıran işaretin adı nedir?", ["Virgül", "Nokta", "Ünlem", "Kesme"], "Virgül eş görevli sözcükleri ayırır."],
    ["Başkasından aynen alınan sözleri belirtmek için hangi işaret çifti kullanılır?", ["Tırnak işaretleri", "İki ünlem", "İki soru işareti", "İki kesme"], "Doğrudan aktarılan sözler tırnak içine alınır."],
    ["Bir metinde ek açıklamayı '(bu örnekte olduğu gibi)' içine alan işaretin adı nedir?", ["Yay ayraç", "Kesme", "İki nokta", "Tırnak"], "Yay ayraç cümlenin yapısı dışında kalan açıklamaları gösterebilir."],
    ["Satır sonunda bitmeyen kelimenin devam edeceğini hangi işaret gösterir?", ["Kısa çizgi", "Ünlem", "Soru işareti", "Noktalı virgül"], "Satıra sığmayan kelimeler bölünürken satır sonuna kısa çizgi konur."],
    ["Bir yazıda konuşmaların başında kullanılan uzun çizginin diğer adı nedir?", ["Konuşma çizgisi", "Kesir çizgisi", "Kesme işareti", "Üst çizgi"], "Uzun çizgi, yazıda satır başındaki konuşmaları belirtir."],
  ]),
  ...make("tllp", "language_literature", "expert", "https://poetry.harvard.edu/guide-prosody", [
    ["Vurguya dayalı İngiliz şiirinde vurgusuz-vurgulu dizilişindeki ayak hangisidir?", ["İamb", "Trochee", "Spondee", "Pyrrhic"], "İamb bir vurgusuz, ardından bir vurgulu hecedir."],
    ["İngiliz şiirinde vurgulu-vurgusuz dizilişindeki ayağa ne denir?", ["Trochee", "İamb", "Anapest", "Spondee"], "Trochee vurgulu hecenin ardından vurgusuz hece getirir."],
    ["İki vurgusuz heceyi bir vurgulu hecenin izlediği ölçü ayağı hangisidir?", ["Anapest", "Daktil", "Trochee", "Spondee"], "Anapestin vurgu dizisi vurgusuz-vurgusuz-vurguludur."],
    ["Vurgulu bir heceyi iki vurgusuz hecenin izlediği ayak hangisidir?", ["Daktil", "Anapest", "İamb", "Pyrrhic"], "Daktilin vurgu dizisi vurgulu-vurgusuz-vurgusuzdur."],
    ["Vurguya dayalı ölçüde art arda iki vurgulu heceye ne denir?", ["Spondee", "İamb", "Trochee", "Pyrrhic"], "Spondee iki vurgulu heceden oluşur."],
    ["İngiliz şiirinin ölçü çözümlemesinde iki vurgusuz heceden oluşan ayak hangisidir?", ["Pyrrhic", "Spondee", "Trochee", "Daktil"], "Pyrrhic iki vurgusuz hecedir; spondeenin tersidir."],
    ["Klasik nicelik ölçüsünde kısa-uzun-kısa dizisine hangi ad verilir?", ["Amphibrach", "Cretic", "Molossus", "Tribrach"], "Amphibrach kısa-uzun-kısa hece dizisidir."],
    ["Klasik ölçüde uzun-kısa-uzun dizilişindeki ayak hangisidir?", ["Cretic", "Amphibrach", "Tribrach", "Daktil"], "Cretic, uzun-kısa-uzun dizisidir."],
    ["Klasik nicelik ölçüsünde üç uzun heceden oluşan ayak hangisidir?", ["Molossus", "Tribrach", "Anapest", "İamb"], "Molossus üç uzun heceden oluşur."],
    ["Klasik nicelik ölçüsünde üç kısa heceden oluşan ayak hangisidir?", ["Tribrach", "Molossus", "Cretic", "Spondee"], "Tribrach üç kısa heceli ayaktır."],
    ["Klasik ölçüde ionic a majore hangi hece dizisini gösterir?", ["Uzun-uzun-kısa-kısa", "Kısa-kısa-uzun-uzun", "Uzun-kısa-uzun-kısa", "Kısa-uzun-kısa-uzun"], "Ionic a majore iki uzun hecenin ardından iki kısa hece getirir."],
  ]),
  ...make("tllv", "language_literature", "expert", "https://poets.org/glossary/villanelle", [
    ["Klasik sabit villanelle toplam kaç dizeden oluşur?", ["19", "14", "24", "39"], "Beş üçlük ve bir dörtlükten oluşan villanelle 19 dizedir."],
    ["Villanelle'in iki nakarat dizesi son kıtada nerede yer alır?", ["Son iki dizede birlikte", "Yalnız ilk dizede", "Hiç yer almaz", "Yalnız ikinci dizede"], "Dönüşümlü nakaratlar son kıtanın son iki dizesinde birleşir."],
    ["Sabit villanelle biçiminin tarihindeki Jean Passerat şiirinin adı hangisidir?", ["J'ay perdu ma tourterelle", "Le Lac", "Le Bateau ivre", "L'Albatros"], "Passerat'nın bu şiiri villanelle biçiminin tarihindeki temel örnektir."],
    ["Villanelle'in 19. yüzyılda sabit biçim olarak tanımlanması hangi Fransız şairle ilişkilidir?", ["Théodore de Banville", "Paul Valéry", "Arthur Rimbaud", "Jacques Prévert"], "Poets.org, biçimin sabitleştirilmesinde Théodore de Banville'i anar."],
  ]),
  ...make("tlls", "language_literature", "expert", "https://poets.org/glossary/sestina", [
    ["Altılı kıtalar ve kapanıştan oluşan klasik sestina kaç dizedir?", ["39", "19", "24", "42"], "Altı altılık ve üç dizelik kapanış toplam 39 dizedir."],
    ["Sestina biçimi hangi Provençal ozana atfedilir?", ["Arnaut Daniel", "François Villon", "Petrarca", "Dante Gabriel Rossetti"], "Sestina'nın ortaya çıkışı 12. yüzyıl ozanı Arnaut Daniel'e atfedilir."],
    ["Sestina'nın ilk kıtasındaki son sözcükler ABCDEF ise ikinci kıtadaki sıralama hangisidir?", ["FAEBDC", "ABCDEF", "FEDCBA", "BADCFE"], "Klasik sestina tekrar düzeninde ikinci kıta FAEBDC sırasını kullanır."],
    ["Sestina'nın envoi ya da tornada denen kapanış bölümü kaç dizedir?", ["Üç", "İki", "Altı", "Sekiz"], "Üç dizelik kapanış, tekrar eden altı sözcüğün tümünü içerir."],
  ]),
  ...make("tllt", "language_literature", "expert", "https://poets.org/glossary/triolet", [
    ["Tekrarlanan diziler büyük harfle gösterildiğinde trioletin şeması hangisidir?", ["ABaAabAB", "ABABCDCD", "ABBAABBA", "ABA BCB CDC"], "Trioletin sekiz dizelik tekrar düzeni ABaAabAB'dir."],
    ["Trioleti 19. yüzyılda İngilizce şiire yeniden tanıtan şair kimdir?", ["Robert Bridges", "T. S. Eliot", "W. H. Auden", "Dylan Thomas"], "Poets.org bu yeniden canlanmayı Robert Bridges ile ilişkilendirir."],
    ["Trioletin ilk dizesi kendi dışında hangi dizelerde aynen tekrarlanır?", ["Dördüncü ve yedinci", "Üçüncü ve altıncı", "İkinci ve beşinci", "Beşinci ve sekizinci"], "İlk dize dördüncü ve yedinci dizelerde yinelenir."],
  ]),
  ...make("tlln", "language_literature", "expert", "https://poets.org/glossary/pantoum", [
    ["Pantoum şiir biçiminin kökeni hangi ülkededir?", ["Malezya", "İtalya", "İzlanda", "Portekiz"], "Pantoum, Malezya'da gelişen halk şiiri biçiminden gelir."],
    ["Pantoumda bir dörtlüğün ikinci ve dördüncü dizeleri sonraki dörtlükte hangi konumlara geçer?", ["Birinci ve üçüncü", "İkinci ve dördüncü", "Üçüncü ve dördüncü", "Birinci ve ikinci"], "Pantoum bu dize aktarımıyla birbirine bağlanan dörtlüklerden oluşur."],
    ["John Ashbery'nin pantouma ilgiyi artıran 1956 tarihli kitabı hangisidir?", ["Some Trees", "The Waste Land", "North", "Ariel"], "Poets.org, Ashbery'nin Some Trees kitabındaki kullanımı vurgular."],
  ]),
  ...make("tllr", "language_literature", "expert", "https://poets.org/glossary/terza-rima", [
    ["Terza rimanın zincirleme uyak düzeni hangi seçenektir?", ["aba bcb cdc", "aabb ccdd eeff", "abba cddc effe", "abab cdcd efef"], "Bir üçlüğün orta dizesi sonraki üçlüğün dış dizelerine uyak verir."],
    ["Terza rimanın İtalyanca ilk uygulamasında yaygın dize uzunluğu kaç hecedir?", ["11", "7", "8", "14"], "Dante'nin terza riması İtalyancanın on bir heceli dizesini kullanır."],
  ]),
  ...make("tllx", "language_literature", "expert", "https://poetry.harvard.edu/guide-poetic-terms", [
    ["İngiliz şiirinde 'blank verse' terimi hangi biçimi anlatır?", ["Uyaklanmamış iambik pentametre", "Her tür ölçüsüz şiir", "Yalnız uyaklı beyit", "Üç dizelik nakarat"], "Blank verse, uyaksız iambik pentametredir; serbest şiirle aynı şey değildir."],
    ["a:b düzeninin b:a biçiminde terslenmesiyle oluşan çapraz söz dizimine ne denir?", ["Chiasmus", "Anaphora", "Assonance", "Climax"], "Chiasmus, öğelerin çapraz terslenmesine dayanan paralelliktir."],
    ["Batı şiiri çözümlemesinde dize içindeki işitilebilir durağa ne denir?", ["Caesura", "Envoi", "Refrain", "Topos"], "Caesura, dize sonu yerine dize içinde bulunan duraktır."],
    ["İngiliz şiirinde heroic couplet hangi iki dizeden oluşur?", ["Birbiriyle uyaklı iki iambik pentametre dizesi", "Uyaksız iki serbest dize", "İki yedi heceli dize", "İki on bir heceli İtalyanca dize"], "Heroic couplet, uyaklı iambik pentametre beyitidir."],
    ["Edebiyat eleştirisinde 'topos' terimi neyi belirtir?", ["Geleneksel tema veya motifi", "Kitabın sayfa sayısını", "Yalnız son uyak harfini", "Yalnız sahne yönergesini"], "Topos, alçakgönüllülük motifi gibi yerleşik bir tema veya motiftir."],
    ["Bir şiirin ritim ve ölçüsünü işaretleyerek çözümlemeye ne denir?", ["Scansion", "Valediction", "Apostrophe", "Synecdoche"], "Scansion, şiirin ritmik ve ölçüsel yapısının belirlenip çözümlemesidir."],
  ]),
];

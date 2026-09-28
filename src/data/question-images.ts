import type { Question } from "../lib/types";

export const QUESTION_IMAGES: Record<string, NonNullable<Question["image"]>> = {
  e11: { src: "/questions/map.webp", alt: "Kara ve deniz alanlarını gösteren, ad ve etiket içermeyen dünya fiziki haritası.", width: 1000, height: 500, credit: "Natural Earth · Kamu malı", licenseUrl: "https://www.naturalearthdata.com/about/terms-of-use/" },
  e64: { src: "/questions/moon.webp", alt: "Ay yüzeyinde çukurun kenarı, taşlar ve uzakta tepeler.", width: 1000, height: 988, credit: "NASA/JSC · Apollo 15", licenseUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/" },
  e118: { src: "/questions/art.webp", alt: "Teknelerin üzerine yükselen dalga ve arka planda küçük bir dağ bulunan Japon baskısı.", width: 600, height: 405, credit: "The Metropolitan Museum of Art · CC0", licenseUrl: "https://www.metmuseum.org/art/collection/search/56353" },
  h108: { src: "/questions/art.webp", alt: "Dalganın altında tekneler ve arka planda bir dağ bulunan Japon baskısı.", width: 600, height: 405, credit: "The Metropolitan Museum of Art · CC0", licenseUrl: "https://www.metmuseum.org/art/collection/search/56353" },
};

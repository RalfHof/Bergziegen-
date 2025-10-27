// src/data/touren.ts

export const touren = [
  {
    id: 1,
    name: "Alte Brauerei Weingarten",
    description: `Unsere Tour führt uns zur gemütlichen "Alten Brauerei" in Karlsruhe-Weingarten. Dort erwartet uns ein Restaurant mit charmant altem Stil, schönem Ambiente und einer freundlichen Atmosphäre. Das besondere Highlight ist das Essen vom heißen Stein, bei dem wir exotische Fleischspezialitäten und auch leckere Gemüseplatten direkt am Tisch selbst zubereiten können. Ein perfekter Ort, um den Wandertag genussvoll und in geselliger Runde ausklingen zu lassen!`,
    images: Array.from({ length: 33 }, (_, i) => `/Tour1_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-1",
    outdooractiveLink: "https://www.outdooractive.com/de/tour-1",
  },
  {
    id: 2,
    name: "Besen Hexe Kreutzbergsee",
    description: `Unsere Tour führt uns zur Besenhex Tiefenbach am Kreutzbergsee. Dort erwartet uns ein besonders attraktives Angebot: ein reichhaltiges Buffet für nur 24 Euro pro Person, bei dem alle Getränke bereits inklusive sind! Freut euch auf eine riesige Auswahl an Speisen in dieser schönen Lokalität. Ein wirklich entspannter und leckerer Abschluss für unsere Wanderung.`,
    distance: "folgt in Kürze",
    duration: "folgt in Kürze",
    difficulty: "leicht",
    ascent: "folgt in Kürze",
    images: Array.from({ length: 18 }, (_, i) => `/Tour2_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-2",
    outdooractiveLink: "https://www.outdooractive.com/de/tour-2",
  },
  {
    id: 3,
    name: "Forsthaus Silbertal",
    description: `Unsere Tour entführt uns in das Herz des Biosphärenreservates Pfälzerwald – eine sehr schöne Wanderung durch den Wald mit vielen Bächen und Sehenswürdigkeiten. Ziel ist das idyllisch und ruhig gelegene Forsthaus Silbertal auf rund 410m Höhe. Dort erwartet uns eine Einkehr mit Pfälzer Gerichten, Wurst aus eigener Herstellung sowie weiteren regionalen und vegetarischen Spezialitäten. Bei gutem Wetter können wir die Natur auf dem Freisitz genießen – der ideale Ausklang für diese schöne Waldtour!`,
    distance: "ca. 9 km",
    duration: "ca. 3:00 Std.",
    difficulty: "mittel",
    ascent: "180 Hm",
    images: Array.from({ length: 25 }, (_, i) => `/Tour3_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-3",
    outdooractiveLink: "https://www.outdooractive.com/de/tour-3",
  },
  {
    id: 4,
    name: "Mondbachschlucht..07.09.25./.04.08.21",
    description: `Tour führt uns in die beeindruckende Monbachtalschlucht – ein echtes Naturerlebnis mit glitzernden Bächen und sattgrünen Flussauen. Der schmale Pfad, der Trittsicherheit erfordert, führt uns immer wieder über Steinquader durch das Tal. Genießt die besondere Atmosphäre dieser Schlucht, bei etwas Glück entdecken wir vielleicht sogar den seltenen Eisvogel! Zum Abschluss kehren wir in die Hausbrauerei Mönchwasen ein und lassen den Tag bei guter bürgerlicher Küche gemütlich ausklingen.`,
    distance: "ca. 10 km",
    duration: "ca. 3:20 Std.",
    difficulty: "mittel",
    ascent: "200 Hm",
    images: Array.from({ length: 101 }, (_, i) => `/Tour4_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-4",
    outdooractiveLink: "https://www.outdooractive.com/de/tour-4",
  },
  {
    id: 5,
    name: "Holz Weißbrot",
    description: `Beschreibung der Tour 5 – folgt in Kürze.`,
    distance: "folgt in Kürze",
    duration: "folgt in Kürze",
    difficulty: "folgt in Kürze",
    ascent: "folgt in Kürze",
    images: Array.from({ length: 17 }, (_, i) => `/Tour5_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-5",
    outdooractiveLink: "https://www.outdooractive.com/de/tour-5",
  },
  {
    id: 6,
    name: "Hambacher Schloss..27.05.25../..15.10.25",
    description: `Das Hambacher Schloss, eine Burgruine aus dem 11. Jahrhundert, spielt eine bedeutende Rolle in der deutschen Demokratiegeschichte. Es wurde am 27. Mai 1832 zum Schauplatz des Hambacher Festes, einem wichtigen Ereignis der Demokratiebewegung im 19. Jahrhundert, und gilt seither als "Wiege der deutschen Demokratie". Unsere Wanderung führt uns auf etwa 10,6 Kilometern durch die malerische Landschaft rund um das Hambacher Schloss und überwindet dabei rund 180 Höhenmeter. Nach der Tour lädt das Weingut Ernst zur gemütlichen Einkehr ein.`,
    distance: "10,6 km",
    duration: "ca. 3:00 Std.",
    difficulty: "mittel",
    ascent: "180 Hm",
    images: Array.from({ length: 25 }, (_, i) => `/Tour6_${i + 1}.jpg`),
    komootLink: "https://www.komoot.de/tour-6",
    outdooractiveLink:
      "https://www.outdooractive.com/de/track/hambacher-schloss-am-15.10.2025-10-49-54/328547961/",
  },
  {
    id: 7,
    name: "Malsch Letzenberg",
    description: `Diese abwechslungsreiche Wanderung rund um den Letzenberg bei Malsch führt durch idyllische Weinberge, vorbei an blühenden Rebhängen und weiten Ausblicken über die Rheinebene.`,
    distance: "11,7 km",
    duration: "3 Std 30 Min",
    difficulty: "Leicht",
    ascent: "172 Hm",
    descent: "220 Hm",
    images: Array.from({ length: 25 }, (_, i) => `/Tour7_${i + 1}.jpg`),
    outdooractiveLink:
      "https://www.outdooractive.com/de/track/malsch-letzenberg-boes-08.10.2025-09-55-14/328054244/",
  },
  {
    id: 17,
    name: "Drachenhöhle & Lambertskreuz",
    description:
      "Eine schöne, mittelschwere Wanderung mit vielen Höhen und Tiefen über Schotterwege, Waldboden und zahlreiche Wurzeln – was die Strecke besonders interessant macht.",
    distance: "10,8 km",
    duration: "4 Std",
    difficulty: "Mittel",
    ascent: "365 Hm",
    images: Array.from({ length: 61 }, (_, i) => `/Tour17_${i + 1}.jpg`),
    video:
      "https://vxdxrojbgltjypxzehsg.supabase.co/storage/v1/object/public/touren-videos/Tour17.mp4",
    komootLink: "https://www.komoot.com/de-de/tour/32777811",
    outdooractiveLink:
      "https://www.outdooractive.com/de/route/wanderung/pfalz/saupferch-drachenfels-lambertskreuz-saupferch/108630848/",
  },
  {
    id: 18,
    name: "Forsthaus Silbertal",
    description: `
    Eine wunderschöne herbstliche Wanderung durch das Silbertal mit sanften Steigungen und viel Natur. Die Strecke führt über leicht begehbare Wege, 
    die bei herbstlichem Laub jedoch etwas rutschig sein können – also Vorsicht beim Gehen! Nach etwa zwei Dritteln der Tour lohnt sich unbedingt eine Einkehr im gemütlichen Forsthaus Silbertal.
     Dort kann man sich bei gutbürgerlicher Küche und einem warmen Getränk stärken, bevor es auf den Rückweg geht.
      Eine entspannte Wanderung mit schöner Atmosphäre – und trotz eines kleinen Missgeschicks (mein Wanderstock ist leider zerbrochen 😅) immer wieder lohnenswert.,`,
    shortDescription: "22.10.25",
    distance: "10,0 km",
    duration: "2 Std 30 Min",
    difficulty: "Leicht",
    ascent: "157 Hm",
    descent: "157 Hm",
    komootLink: "https://www.komoot.de/tour-18",
    outdooractiveLink:
      "https://www.outdooractive.com/de/track/silbertal-22.10.2025-10-33-45/328986004/",
    images: Array.from({ length: 19 }, (_, i) => `/Tour18_${i + 1}.jpg`),
    video:
      "https://vxdxrojbgltjypxzehsg.supabase.co/storage/v1/object/public/touren-videos/Tour18.mp4",
    subTours: [
      {
        id: "18a",
        name: "Silbertal Herbsttour 2025",
        description:
          "Eine goldene Herbsttour mit buntem Laub, klarer Luft und wunderschöner Atmosphäre im Pfälzerwald.",
        distance: "10,0 km",
        duration: "2 Std 30 Min",
        difficulty: "Leicht",
        ascent: "157 Hm",
        images: Array.from({ length: 19 }, (_, i) => `/Tour18a_${i + 1}.jpg`),
        outdooractiveLink:
          "https://www.outdooractive.com/de/track/silbertal-22.10.2025-10-33-45/328986004/",
        komootLink: "https://www.komoot.de/tour-18a",
        video:
          "https://vxdxrojbgltjypxzehsg.supabase.co/storage/v1/object/public/touren-videos/Tour18a.mp4",
      },
      {
        id: "18b",
        name: "Silbertal Frühlingstour 2025",
        description:
          "Eine zweite Variante der Silbertal-Wanderung – diesmal im Frühling mit frischem Grün und Vogelgezwitscher.",
        distance: "10,2 km",
        duration: "2 Std 45 Min",
        difficulty: "Leicht",
        ascent: "165 Hm",
        images: Array.from({ length: 15 }, (_, i) => `/Tour18b_${i + 1}.jpg`),
        outdooractiveLink:
          "https://www.outdooractive.com/de/track/silbertal-fruehling-2025/329123456/",
        komootLink: "https://www.komoot.de/tour-18b",
      },
    ],
  },
];

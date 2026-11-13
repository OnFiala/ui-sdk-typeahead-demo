type City = {
  value: string
  label: string
  region: string
  residents: number
  keywords: string[]
}

const cities = [
  {
    value: "praha",
    label: "Praha",
    region: "Prague",
    residents: 1_357_000,
    keywords: ["Prague", "capital"],
  },
  {
    value: "brno",
    label: "Brno",
    region: "South Moravian",
    residents: 400_000,
    keywords: ["Jihomoravský"],
  },
  {
    value: "ostrava",
    label: "Ostrava",
    region: "Moravian-Silesian",
    residents: 283_000,
    keywords: ["Moravskoslezský"],
  },
  {
    value: "plzen",
    label: "Plzeň",
    region: "Plzeň",
    residents: 181_000,
    keywords: ["Pilsen"],
  },
  {
    value: "liberec",
    label: "Liberec",
    region: "Liberec",
    residents: 107_000,
    keywords: [],
  },
  {
    value: "olomouc",
    label: "Olomouc",
    region: "Olomouc",
    residents: 102_000,
    keywords: [],
  },
  {
    value: "ceske-budejovice",
    label: "České Budějovice",
    region: "South Bohemian",
    residents: 97_000,
    keywords: ["Budweis", "Jihocesky"],
  },
  {
    value: "hradec-kralove",
    label: "Hradec Králové",
    region: "Hradec Králové",
    residents: 93_000,
    keywords: ["Königgrätz"],
  },
  {
    value: "pardubice",
    label: "Pardubice",
    region: "Pardubice",
    residents: 92_000,
    keywords: [],
  },
  {
    value: "usti-nad-labem",
    label: "Ústí nad Labem",
    region: "Ústí nad Labem",
    residents: 91_000,
    keywords: ["Aussig"],
  },
  {
    value: "zlin",
    label: "Zlín",
    region: "Zlín",
    residents: 74_000,
    keywords: ["Gottwaldov"],
  },
  {
    value: "havirov",
    label: "Havířov",
    region: "Moravian-Silesian",
    residents: 69_000,
    keywords: [],
  },
  {
    value: "kladno",
    label: "Kladno",
    region: "Central Bohemian",
    residents: 69_000,
    keywords: ["Stredocesky"],
  },
  {
    value: "most",
    label: "Most",
    region: "Ústí nad Labem",
    residents: 64_000,
    keywords: [],
  },
  {
    value: "opava",
    label: "Opava",
    region: "Moravian-Silesian",
    residents: 55_000,
    keywords: ["Troppau"],
  },
  {
    value: "frydek-mistek",
    label: "Frýdek-Místek",
    region: "Moravian-Silesian",
    residents: 54_000,
    keywords: [],
  },
  {
    value: "jihlava",
    label: "Jihlava",
    region: "Vysočina",
    residents: 53_000,
    keywords: ["Iglau"],
  },
  {
    value: "teplice",
    label: "Teplice",
    region: "Ústí nad Labem",
    residents: 50_000,
    keywords: [],
  },
  {
    value: "karvina",
    label: "Karviná",
    region: "Moravian-Silesian",
    residents: 49_000,
    keywords: [],
  },
  {
    value: "karlovy-vary",
    label: "Karlovy Vary",
    region: "Karlovy Vary",
    residents: 49_000,
    keywords: ["Carlsbad", "Karlsbad"],
  },
  {
    value: "decin",
    label: "Děčín",
    region: "Ústí nad Labem",
    residents: 47_000,
    keywords: ["Tetschen"],
  },
  {
    value: "chomutov",
    label: "Chomutov",
    region: "Ústí nad Labem",
    residents: 47_000,
    keywords: [],
  },
  {
    value: "jablonec",
    label: "Jablonec nad Nisou",
    region: "Liberec",
    residents: 46_000,
    keywords: [],
  },
  {
    value: "mlada-boleslav",
    label: "Mladá Boleslav",
    region: "Central Bohemian",
    residents: 45_000,
    keywords: [],
  },
  {
    value: "prostejov",
    label: "Prostějov",
    region: "Olomouc",
    residents: 43_000,
    keywords: [],
  },
  {
    value: "prerov",
    label: "Přerov",
    region: "Olomouc",
    residents: 41_000,
    keywords: [],
  },
  {
    value: "ceska-lipa",
    label: "Česká Lípa",
    region: "Liberec",
    residents: 37_000,
    keywords: [],
  },
  {
    value: "trebic",
    label: "Třebíč",
    region: "Vysočina",
    residents: 35_000,
    keywords: [],
  },
  {
    value: "trinec",
    label: "Třinec",
    region: "Moravian-Silesian",
    residents: 34_000,
    keywords: [],
  },
  {
    value: "tabor",
    label: "Tábor",
    region: "South Bohemian",
    residents: 34_000,
    keywords: [],
  },
  {
    value: "znojmo",
    label: "Znojmo",
    region: "South Moravian",
    residents: 34_000,
    keywords: [],
  },
  {
    value: "kolin",
    label: "Kolín",
    region: "Central Bohemian",
    residents: 33_000,
    keywords: [],
  },
] satisfies City[]

const cityByValue = new Map(cities.map((city) => [city.value, city]))

const cityItems: City[] = cities.map((city) => ({
  ...city,
  keywords: [city.region, ...city.keywords],
}))

const residents = new Intl.NumberFormat("en", { maximumFractionDigits: 0 })

export { cities, cityByValue, cityItems, residents }
export type { City }

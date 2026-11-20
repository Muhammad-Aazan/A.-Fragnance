export function formatPKR(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-PK");
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceAlt?: number;
  priceAltLabel?: string;
  volume: string;
  type: string;
  category: "Perfumes" | "Attars" | "Oud" | "Luxury Editions";
  concentration: string;
  gender: string;
  rating: number;
  reviews: number;
  image: string;
  model3d?: string;
  description: string;
  story: string;
  opening: string[];
  heart: string[];
  trail: string[];
  collection: string;
  collectionSlug: "signature-trilogy" | "imperial-attars" | "private-reserve";
  badge?: string;
  scentProfile?: string[];
  isFeatured?: boolean;
}

export interface CollectionInfo {
  slug: "signature-trilogy" | "imperial-attars" | "private-reserve";
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}

export const collections: CollectionInfo[] = [
  {
    slug: "signature-trilogy",
    title: "The Signature Trilogy",
    subtitle: "Three Expressions. One Obsession.",
    description:
      "The foundation of A. Fragrance. Three iconic extraits crafted with high concentrations of rare naturals, leaving a sillage that commands presence without shouting.",
    image: "/luxury-flacon.jpg",
    badge: "COLLECTION 01",
  },
  {
    slug: "imperial-attars",
    title: "The Imperial Attars & Pure Oils",
    subtitle: "Sacred Distillations. Zero Alcohol.",
    description:
      "Crafted in accordance with centuries-old Arabian distillation traditions. Pure, skin-intimate perfume oils aged in vintage glass demijohns and presented in bespoke crystal bottles.",
    image: "/attar-sultan.jpg",
    badge: "COLLECTION 02",
  },
  {
    slug: "private-reserve",
    title: "The Private Reserve",
    subtitle: "Numbered Decanters. Rarest Harvests.",
    description:
      "Reserved for our most discerning patrons. Extremely limited annual runs using centuries-aged Assam agarwood, wild ambergris and vintage sandalwood distillates.",
    image: "/celestial-oud.jpg",
    badge: "COLLECTION 03",
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "oud-noir",
    name: "Oud Noir",
    tagline: "SMOKY · WOODY · INTENSE",
    price: 18500,
    priceAlt: 28000,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviews: 128,
    image: "/luxury-flacon.jpg",
    model3d: "/models/perfume_bottles_with_floral_motives.glb",
    description: "An unforgettable trail of rare oud, saffron and smoky sandalwood.",
    story:
      "Darkness, with a golden soul. Rare oud unfolds through saffron and rose before settling into a lingering embrace of smoky sandalwood and worn Tuscan leather.",
    opening: ["Saffron", "Bergamot"],
    heart: ["Bulgarian rose", "Oud"],
    trail: ["Sandalwood", "Leather", "Amber"],
    collection: "Perfumes",
    collectionSlug: "signature-trilogy",
    badge: "01",
    scentProfile: ["Woody & Smoky", "Warm Amber"],
    isFeatured: true,
  },
  {
    id: "2",
    slug: "amber-elixir",
    name: "Amber Elixir",
    tagline: "WARM · AMBER · SENSUAL",
    price: 16500,
    priceAlt: 24500,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviews: 96,
    image: "/cbc113c162329708705a8c9d568dfb40f3e40664.png",
    model3d: "/models/perfume_bottles_with_floral_motives.glb",
    description: "Golden amber, rich vanilla and a warmth that stays close to the skin.",
    story:
      "Golden amber at its purest. A composition that wraps the skin in warmth — amber, rich vanilla and a trail that lingers like a secret whispered close in candlelit salons.",
    opening: ["Bergamot", "Cardamom"],
    heart: ["Amber", "Rose"],
    trail: ["Vanilla", "Sandalwood"],
    collection: "Perfumes",
    collectionSlug: "signature-trilogy",
    badge: "02",
    scentProfile: ["Warm Amber", "Sensual Vanilla"],
    isFeatured: true,
  },
  {
    id: "3",
    slug: "royal-musk",
    name: "Royal Musk",
    tagline: "SOFT · MUSKY · REGAL",
    price: 17500,
    priceAlt: 26000,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviews: 84,
    image: "/5fcd58373e5d8421f1bba0b6212df03fde048044.png",
    model3d: "/models/perfume_bottles_with_floral_motives.glb",
    description: "Velvety musk meets green cardamom and the quiet elegance of iris.",
    story:
      "A fragrance that moves with you. Royal Musk opens with crisp green notes and cardamom, before revealing the quiet confidence of iris and a trail of pure, skin-close crystalline musk.",
    opening: ["Bergamot", "Green notes"],
    heart: ["Iris", "Cardamom"],
    trail: ["Musk", "Cedarwood"],
    collection: "Perfumes",
    collectionSlug: "signature-trilogy",
    badge: "03",
    scentProfile: ["Royal Musk", "Clean & Regal"],
    isFeatured: true,
  },
  {
    id: "4",
    slug: "attar-sultan",
    name: "Attar Sultan",
    tagline: "ORIENTAL · GOLDEN AMBER · RESINOUS",
    price: 22000,
    priceAlt: 38000,
    priceAltLabel: "24 ML",
    volume: "12 ml",
    type: "Pure Concentrated Attar Oil",
    category: "Attars",
    concentration: "100% Pure Oil (Zero Alcohol)",
    gender: "Unisex",
    rating: 5.0,
    reviews: 64,
    image: "/attar-sultan.jpg",
    model3d: "/models/perfume_bottle_with_a_floral_miniature.glb",
    description: "Distilled over twenty-one sunrises. Golden amber, frankincense tears and vintage rose.",
    story:
      "A sacred formulation crafted without alcohol. Golden amber aged alongside tears of wild Omani frankincense, crushed cardamom pods, and a majestic finish of aged sandalwood oil applied drop by drop with an antique gold wand.",
    opening: ["Frankincense", "Green Cardamom"],
    heart: ["Damascena Rose", "Golden Amber Resin"],
    trail: ["Mysore Sandalwood", "Dark Honey"],
    collection: "Attars",
    collectionSlug: "imperial-attars",
    badge: "ATTAR 01",
    scentProfile: ["Warm Amber", "Woody & Smoky"],
    isFeatured: true,
  },
  {
    id: "5",
    slug: "attar-rose-taif",
    name: "Attar Rose Taif",
    tagline: "FLORAL · VELVET ROSE · PRECIOUS",
    price: 24500,
    priceAlt: 42000,
    priceAltLabel: "24 ML",
    volume: "12 ml",
    type: "Pure Concentrated Attar Oil",
    category: "Attars",
    concentration: "100% Pure Oil (Zero Alcohol)",
    gender: "Unisex",
    rating: 4.9,
    reviews: 58,
    image: "/attar-rose-taif.jpg",
    model3d: "/models/perfume_bottle_with_a_floral_miniature.glb",
    description: "Ten thousand dawn-plucked Taif rose petals concentrated into liquid velvet.",
    story:
      "Harvested before sunrise in the high mountain valleys of Taif. Each faceted crystal bottle captures the pure essence of thousands of dewy crimson petals infused into rare white sandalwood, delivering an intoxicating, powdery-fresh rose aura that endures for days.",
    opening: ["Dewy Rosebuds", "Pink Peppercorn"],
    heart: ["Taif Rose Absolute", "Saffron Threads"],
    trail: ["White Amber", "Cashmere Sandalwood"],
    collection: "Attars",
    collectionSlug: "imperial-attars",
    badge: "ATTAR 02",
    scentProfile: ["Floral & Rose", "Sensual Vanilla"],
    isFeatured: true,
  },
  {
    id: "6",
    slug: "dehn-al-oud-kalakassi",
    name: "Dehn Al Oud Kalakassi",
    tagline: "BALSAMIC · RAW AGARWOOD · TIMELESS",
    price: 39000,
    priceAlt: 69000,
    priceAltLabel: "12 ML",
    volume: "6 ml",
    type: "Pure Vintage Agarwood Oil",
    category: "Oud",
    concentration: "100% Wild Distillate",
    gender: "Unisex",
    rating: 5.0,
    reviews: 42,
    image: "/dehn-al-oud.jpg",
    model3d: "/models/perfume_bottle_with_a_landscape.glb",
    description: "25-year aged wild Cambodian oud. Thick, balsamic, majestic.",
    story:
      "A treasury heirloom. Extracted from ancient wild agarwood trees and aged for a quarter-century in darkened cellars. Deep balsamic notes transition into smoky caramel, dried fruits and ancient monastery woods.",
    opening: ["Aged Leather", "Dried Dark Plum"],
    heart: ["Wild Cambodian Agarwood", "Smoked Honey"],
    trail: ["Resinous Amber", "Ancient Cedar"],
    collection: "Oud",
    collectionSlug: "imperial-attars",
    badge: "OUD 01",
    scentProfile: ["Woody & Smoky", "Warm Amber"],
    isFeatured: true,
  },
  {
    id: "7",
    slug: "noir-santal",
    name: "Noir Santal",
    tagline: "CREAMY · SMOKY WOOD · MEDITATIVE",
    price: 26000,
    priceAlt: 39500,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Luxury Editions",
    concentration: "28% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviews: 73,
    image: "/noir-santal.jpg",
    model3d: "/models/perfume_bottle_with_a_landscape.glb",
    description: "Smoked obsidian glass cradling rare sustainably aged Australian and Mysore sandalwood.",
    story:
      "A tribute to silence and sanctuary. Creamy, milk-soft sandalwood wrapped in smoked iris root, cedar shavings, and black pepper, creating a tactile aura that radiates quiet luxury.",
    opening: ["Black Pepper", "Smoked Nutmeg"],
    heart: ["Florentine Orris", "Violet Leaf"],
    trail: ["Vintage Sandalwood", "Cashmeran", "Birch Tar"],
    collection: "Luxury Editions",
    collectionSlug: "private-reserve",
    badge: "RESERVE 01",
    scentProfile: ["Woody & Smoky", "Clean & Regal"],
    isFeatured: false,
  },
  {
    id: "8",
    slug: "celestial-oud",
    name: "Celestial Oud",
    tagline: "MIDNIGHT SAPPHIRE · STELLAR · MAJESTIC",
    price: 45000,
    volume: "100 ml",
    type: "Private Reserve Edition",
    category: "Luxury Editions",
    concentration: "30% Haute Concentration",
    gender: "Unisex",
    rating: 5.0,
    reviews: 39,
    image: "/celestial-oud.jpg",
    model3d: "/models/perfume_bottle_with_a_landscape.glb",
    description: "Numbered midnight sapphire decanters. Blue lotus, saffron threads and 30-year Assam oud.",
    story:
      "The pinnacle of the house. Housed in a hand-polished midnight blue crystal decanter adorned with a brushed 24k gold collar. Blue lotus blossoms floating over aged Assam oud and white ambergris create an otherworldly sillage.",
    opening: ["Blue Lotus", "Saffron Threads"],
    heart: ["Assam Agarwood", "Damask Rose"],
    trail: ["White Ambergris", "Patchouli Coeur"],
    collection: "Luxury Editions",
    collectionSlug: "private-reserve",
    badge: "RESERVE 02",
    scentProfile: ["Woody & Smoky", "Floral & Rose"],
    isFeatured: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

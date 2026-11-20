import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const collectionsData = [
  {
    slug: "signature-trilogy",
    name: "The Signature Trilogy",
    tagline: "Three Expressions. One Obsession.",
    description:
      "The foundation of A. Fragnance. Three iconic extraits crafted with high concentrations of rare naturals, leaving a sillage that commands presence without shouting.",
    image: "/f3d9091393e6991422df35b48837783c12d1896b.png",
  },
  {
    slug: "imperial-attars",
    name: "The Imperial Attars & Pure Oils",
    tagline: "Sacred Distillations. Zero Alcohol.",
    description:
      "Crafted in accordance with centuries-old Arabian distillation traditions. Pure, skin-intimate perfume oils aged in vintage glass demijohns and presented in bespoke crystal flacons.",
    image: "/attar-sultan.jpg",
  },
  {
    slug: "private-reserve",
    name: "The Private Reserve",
    tagline: "Numbered Decanters. Rarest Harvests.",
    description:
      "Reserved for our most discerning patrons. Extremely limited annual runs using centuries-aged Assam agarwood, wild ambergris and vintage sandalwood distillates.",
    image: "/celestial-oud.jpg",
  },
];

const productsData = [
  {
    slug: "oud-noir",
    name: "Oud Noir",
    tagline: "SMOKY · WOODY · INTENSE",
    price: 185,
    priceAlt: 280,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 128,
    image: "/f3d9091393e6991422df35b48837783c12d1896b.png",
    description: "An unforgettable trail of rare oud, saffron and smoky sandalwood.",
    story:
      "Darkness, with a golden soul. Rare oud unfolds through saffron and rose before settling into a lingering embrace of smoky sandalwood and worn Tuscan leather.",
    opening: "Saffron, Bergamot",
    heart: "Bulgarian rose, Oud",
    trail: "Sandalwood, Leather, Amber",
    badge: "01",
    collectionSlug: "signature-trilogy",
  },
  {
    slug: "amber-elixir",
    name: "Amber Elixir",
    tagline: "WARM · AMBER · SENSUAL",
    price: 165,
    priceAlt: 245,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 96,
    image: "/cbc113c162329708705a8c9d568dfb40f3e40664.png",
    description: "Golden amber, rich vanilla and a warmth that stays close to the skin.",
    story:
      "Golden amber at its purest. A composition that wraps the skin in warmth — amber, rich vanilla and a trail that lingers like a secret whispered close in candlelit salons.",
    opening: "Bergamot, Cardamom",
    heart: "Amber, Rose",
    trail: "Vanilla, Sandalwood",
    badge: "02",
    collectionSlug: "signature-trilogy",
  },
  {
    slug: "royal-musk",
    name: "Royal Musk",
    tagline: "SOFT · MUSKY · REGAL",
    price: 175,
    priceAlt: 260,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Perfumes",
    concentration: "25% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 84,
    image: "/5fcd58373e5d8421f1bba0b6212df03fde048044.png",
    description: "Velvety musk meets green cardamom and the quiet elegance of iris.",
    story:
      "A fragrance that moves with you. Royal Musk opens with crisp green notes and cardamom, before revealing the quiet confidence of iris and a trail of pure, skin-close crystalline musk.",
    opening: "Bergamot, Green notes",
    heart: "Iris, Cardamom",
    trail: "Musk, Cedarwood",
    badge: "03",
    collectionSlug: "signature-trilogy",
  },
  {
    slug: "attar-sultan",
    name: "Attar Sultan",
    tagline: "ORIENTAL · GOLDEN AMBER · RESINOUS",
    price: 220,
    priceAlt: 380,
    priceAltLabel: "24 ML",
    volume: "12 ml",
    type: "Pure Concentrated Attar Oil",
    category: "Attars",
    concentration: "100% Pure Oil (Zero Alcohol)",
    gender: "Unisex",
    rating: 5.0,
    reviewsCount: 64,
    image: "/attar-sultan.jpg",
    description: "Distilled over twenty-one sunrises. Golden amber, frankincense tears and vintage rose.",
    story:
      "A sacred formulation crafted without alcohol. Golden amber aged alongside tears of wild Omani frankincense, crushed cardamom pods, and a majestic finish of aged sandalwood oil applied drop by drop with an antique gold wand.",
    opening: "Frankincense, Green Cardamom",
    heart: "Damascena Rose, Golden Amber Resin",
    trail: "Mysore Sandalwood, Dark Honey",
    badge: "ATTAR 01",
    collectionSlug: "imperial-attars",
  },
  {
    slug: "attar-rose-taif",
    name: "Attar Rose Taif",
    tagline: "FLORAL · VELVET ROSE · PRECIOUS",
    price: 245,
    priceAlt: 420,
    priceAltLabel: "24 ML",
    volume: "12 ml",
    type: "Pure Concentrated Attar Oil",
    category: "Attars",
    concentration: "100% Pure Oil (Zero Alcohol)",
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 58,
    image: "/attar-rose-taif.jpg",
    description: "Ten thousand dawn-plucked Taif rose petals concentrated into liquid velvet.",
    story:
      "Harvested before sunrise in the high mountain valleys of Taif. Each faceted ruby flacon captures the pure essence of thousands of dewy crimson petals infused into rare white sandalwood, delivering an intoxicating, powdery-fresh rose aura that endures for days.",
    opening: "Dewy Rosebuds, Pink Peppercorn",
    heart: "Taif Rose Absolute, Saffron Threads",
    trail: "White Amber, Cashmere Sandalwood",
    badge: "ATTAR 02",
    collectionSlug: "imperial-attars",
  },
  {
    slug: "dehn-al-oud-kalakassi",
    name: "Dehn Al Oud Kalakassi",
    tagline: "BALSAMIC · RAW AGARWOOD · TIMELESS",
    price: 390,
    priceAlt: 690,
    priceAltLabel: "12 ML",
    volume: "6 ml",
    type: "Pure Vintage Agarwood Oil",
    category: "Oud",
    concentration: "100% Wild Distillate",
    gender: "Unisex",
    rating: 5.0,
    reviewsCount: 42,
    image: "/dehn-al-oud.jpg",
    description: "25-year aged wild Cambodian oud. Thick, balsamic, majestic.",
    story:
      "A treasury heirloom. Extracted from ancient wild agarwood trees and aged for a quarter-century in darkened cellars. Deep balsamic notes transition into smoky caramel, dried fruits and ancient monastery woods.",
    opening: "Aged Leather, Dried Dark Plum",
    heart: "Wild Cambodian Agarwood, Smoked Honey",
    trail: "Resinous Amber, Ancient Cedar",
    badge: "OUD 01",
    collectionSlug: "imperial-attars",
  },
  {
    slug: "noir-santal",
    name: "Noir Santal",
    tagline: "CREAMY · SMOKY WOOD · MEDITATIVE",
    price: 260,
    priceAlt: 395,
    priceAltLabel: "100 ML",
    volume: "50 ml",
    type: "Extrait de parfum",
    category: "Luxury Editions",
    concentration: "28% concentration",
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 73,
    image: "/noir-santal.jpg",
    description: "Smoked obsidian glass cradling rare sustainably aged Australian and Mysore sandalwood.",
    story:
      "A tribute to silence and sanctuary. Creamy, milk-soft sandalwood wrapped in smoked iris root, cedar shavings, and black pepper, creating a tactile aura that radiates quiet luxury.",
    opening: "Black Pepper, Smoked Nutmeg",
    heart: "Florentine Orris, Violet Leaf",
    trail: "Vintage Sandalwood, Cashmeran, Birch Tar",
    badge: "RESERVE 01",
    collectionSlug: "private-reserve",
  },
  {
    slug: "celestial-oud",
    name: "Celestial Oud",
    tagline: "MIDNIGHT SAPPHIRE · STELLAR · MAJESTIC",
    price: 450,
    volume: "100 ml",
    type: "Private Reserve Flacon",
    category: "Luxury Editions",
    concentration: "30% Haute Concentration",
    gender: "Unisex",
    rating: 5.0,
    reviewsCount: 39,
    image: "/celestial-oud.jpg",
    description: "Numbered midnight sapphire decanters. Blue lotus, saffron threads and 30-year Assam oud.",
    story:
      "The pinnacle of the house. Housed in a hand-polished midnight blue crystal decanter adorned with a brushed 24k gold collar. Blue lotus blossoms floating over aged Assam oud and white ambergris create an otherworldly sillage.",
    opening: "Blue Lotus, Saffron Threads",
    heart: "Assam Agarwood, Damask Rose",
    trail: "White Ambergris, Patchouli Coeur",
    badge: "RESERVE 02",
    collectionSlug: "private-reserve",
  },
];

async function main() {
  console.log("Seeding collections...");
  for (const col of collectionsData) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
  }

  console.log("Seeding products...");
  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

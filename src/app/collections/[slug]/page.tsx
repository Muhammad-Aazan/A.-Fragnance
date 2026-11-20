import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getProductsByCollection } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

export function generateStaticParams() {
  return [
    { slug: "signature-trilogy" },
    { slug: "imperial-attars" },
    { slug: "private-reserve" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return {
      title: "Collection | A. Fragrance",
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "https://afragrance.pk";
  const collectionUrl = `${siteUrl}/collections/${collection.slug}`;

  return {
    title: `${collection.title} — ${collection.subtitle}`,
    description: `${collection.description} Handcrafted luxury perfumes and attars.`,
    alternates: {
      canonical: collectionUrl,
    },
    openGraph: {
      title: `${collection.title} | A. Fragrance`,
      description: collection.description,
      url: collectionUrl,
      images: [
        {
          url: collection.image,
          width: 800,
          height: 600,
          alt: collection.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) notFound();

  const collectionProducts = getProductsByCollection(slug as any);

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#756a5c] tracking-widest mb-10">
          <Link href="/" className="hover:text-[#8a6829] transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#8a6829] transition-colors">COLLECTIONS</Link>
          <span>/</span>
          <span className="text-[#171513] uppercase">{collection.title}</span>
        </nav>

        {/* Collection Hero */}
        <div className="border border-[#e6decb] bg-white p-8 md:p-14 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#8a6829] text-xs tracking-[0.4em] uppercase font-mono">
                {collection.badge}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-[#171513]">
                {collection.title}
              </h1>
              <p className="text-[#c6a56b] text-base font-serif italic">
                {collection.subtitle}
              </p>
              <p className="text-[#5c5348] text-sm leading-relaxed font-light">
                {collection.description}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] bg-[#faf8f5] border border-[#e6decb] overflow-hidden rounded-xl">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Collection Products Grid */}
        <div className="mb-10 flex items-center justify-between border-b border-[#e6decb] pb-4">
          <span className="text-[#8a6829] text-xs font-mono tracking-widest uppercase">
            CREATIONS IN THIS WARDROBE ({collectionProducts.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

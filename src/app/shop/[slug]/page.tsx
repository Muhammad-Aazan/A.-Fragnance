import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import ProductDetail from "@/components/shop/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Creation Not Found | A. Fragrance",
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "https://afragrance.pk";
  const productUrl = `${siteUrl}/shop/${product.slug}`;
  const title = `${product.name} — ${product.type} (${product.volume})`;
  const description = `${product.description} Scent notes: ${product.opening.join(", ")} (Top), ${product.heart.join(", ")} (Heart), ${product.trail.join(", ")} (Base). Handcrafted in Pakistan.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      product.type,
      ...product.opening,
      ...product.heart,
      ...product.trail,
      "A. Fragrance",
      "Buy Perfume Pakistan",
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} — Luxury Extrait | A. Fragrance`,
      description: `${product.tagline} · Rs. ${product.price.toLocaleString()} · ${product.description}`,
      url: productUrl,
      siteName: "A. Fragrance",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: `${product.name} Luxury Flacon`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — A. Fragrance`,
      description: `${product.tagline} · Rs. ${product.price.toLocaleString()}`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const siteUrl = process.env.NEXTAUTH_URL || "https://afragrance.pk";
  const productUrl = `${siteUrl}/shop/${product.slug}`;

  // Google Rich Snippet (Schema.org JSON-LD)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${siteUrl}${product.image}`,
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "A. Fragrance",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "A. Fragrance",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews || 50,
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}

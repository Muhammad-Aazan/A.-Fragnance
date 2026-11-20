import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://afragrance.pk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/account",
          "/reset-password",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/account",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

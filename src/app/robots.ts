import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboards/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/profile",
          "/charts",
          "/tables",
          "/forms",
          "/calendar",
          "/pages/",
          "/ui-elements/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://www.healingourth.com/sitemap.xml",
  };
}

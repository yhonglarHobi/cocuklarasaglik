
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/"], // Admin ve API yollarını engelle
        },
        sitemap: "https://cocuklarasaglik.com/sitemap.xml",
    };
}

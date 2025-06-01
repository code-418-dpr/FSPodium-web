import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "FSPodium",
        short_name: "FSPodium",
        description: "Платформа координации ФСП и регионов",
        start_url: "/",
        display: "standalone",
        background_color: "#08091D",
        theme_color: "#08091D",
        icons: [
            {
                sizes: "512x512",
                src: "icon.png",
                type: "image/png",
            },
        ],
    };
}

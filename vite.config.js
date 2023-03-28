import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());
    const pwa = mode !== "development" && env.VITE_PWA !== "false";
    const plugins = [];
    let build = {};

    // Default plugins
    plugins.push(
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    gameName: env.VITE_NAME,
                    development: mode === "development",
                },
            },
        }),
    );

    if (mode !== "development") {
        if (pwa) {
            plugins.push(
                VitePWA({
                    mode: mode,
                    includeAssets: [],
                    manifest: {
                        name: env.VITE_NAME,
                        short_name: env.VITE_NAME,
                        description: env.VITE_DESCRIPTION || "",
                        theme_color: "#ffffff",
                        display: "fullscreen",
                        orientation: "portrait",
                        icons: [
                            {
                                src: "icons/icons-192.png",
                                sizes: "192x192",
                                type: "image/png",
                            },
                            {
                                src: "icons/icons-512.png",
                                sizes: "512x512",
                                type: "image/png",
                            },
                            {
                                src: "icons/icons-512.png",
                                sizes: "512x512",
                                type: "image/png",
                                purpose: "maskable",
                            },
                        ],
                    },
                }),
            );
        }

        build = {
            build: {
                minify: "esbuild",
            },
            esbuild: {
                drop: ["console", "debugger"],
            },
        };
    }

    let openMode = "https://localhost:3000";

    if (mode === "production") {
        openMode = "https://localhost:4173";
    }

    return {
        plugins,
        ...build,
        base: env.VITE_URL_BASE,
        server: {
            host: true,
            https: true,
            open: openMode,
        },
    };
});

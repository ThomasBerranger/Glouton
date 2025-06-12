import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pwaOptions: Partial<VitePWAOptions> = {
    base: '/Glouton/',
    registerType: 'prompt',
    devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
    },
    strategies: 'generateSW' as const,
    includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    injectRegister: 'script',
    manifest: {
        name: 'Glouton',
        short_name: 'Glouton',
        description: 'Anti-waste application for food lovers.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/Glouton/',
        scope: '/Glouton/',
        icons: [
            {
                src: '/Glouton/android/android-144x144.png',
                sizes: '144x144',
                type: 'image/png'
            },
            {
                src: '/Glouton/android/android-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/Glouton/android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                src: '/Glouton/android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/Glouton/android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
        categories: ['food', 'lifestyle'],
        orientation: 'any',
        lang: 'fr'
    },
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,ttf}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        runtimeCaching: [{
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst' as const,
            options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }]
    }
}

const config: UserConfig = {
    plugins: [
        vue(),
        VitePWA(pwaOptions)
    ],
    define: {
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        'process.env': {}
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    },
    base: '/Glouton/'
}

export default defineConfig(config)
import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa"
import * as path from 'path'

const pwaOptions: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    devOptions: {
        enabled: true
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon'],
    manifest: {
        name: 'Glouton',
        short_name: 'Glouton',
        description: 'Anti-waste application for food lovers.',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'android/android-144x144.png',
                sizes: '144x144',
                type: 'image/png'
            },
            {
                src: 'android/android-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                src: 'android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'android/android-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ]
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
            '@': path.resolve(path.dirname(''), './src')
        }
    },
    base: '/Glouton/'
}

export default defineConfig(config)
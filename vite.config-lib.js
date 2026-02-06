import path from "node:path";
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader'
import replace from '@rollup/plugin-replace';

const name = "index";
const BANNER = `/*!
 * BookiFlex Booking Widget
 * License: GPL-2.0-or-later
 * © 2026 BookiFlex
 *
 * Uses external libraries: Vue.js (MIT)
 * Uses WordPress-provided libraries: @wordpress/i18n (GPL-2.0-or-later)
 *
 * This bundle includes third-party code:
 * - floating-vue (MIT)
 *   https://github.com/Akryum/floating-vue
 * - GLightbox (MIT, version 3.x)
 *   https://github.com/biati-digital/glightbox
 */`

export default defineConfig({
  plugins: [
    // Remove Plyr CDN URLs from glightbox bundle (WordPress.org compliance)
    // GLightbox includes hardcoded CDN URLs for Plyr video player which we don't use
    replace({
      preventAssignment: true,
      values: {
        'https://cdn.plyr.io/3.6.12/plyr.css': '',
        'https://cdn.plyr.io/3.6.12/plyr.js': '',
      }
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('bflex-'),
        },
      },
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // publicDir: true,
  build: {
    manifest: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name,
      fileName: () => 'index.[hash].js',
      formats: ['umd']
    },
    rollupOptions: {
      external: ["vue", '@wordpress/i18n'],
      output: {
        globals: {
          vue: "Vue",
        '@wordpress/i18n': 'wp.i18n',
        },
        inlineDynamicImports: true,
        assetFileNames: 'style.[hash].css',
        banner: BANNER
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: ['log', 'debug', 'info'], // удаляем только log, debug, info
        drop_debugger: true, // удаляем debugger statements
      },
      mangle: {
        // Не переименовываем функции WordPress
        reserved: ['wp', 'i18n', '__', 'sprintf', '_x', '_n', '_nx']
      },
      format: {
        // comments: false // Удаляем комментарии
      }
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
  },
});

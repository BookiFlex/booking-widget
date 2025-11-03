import path from "node:path";
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader'

const name = "index";

export default defineConfig({
  plugins: [
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
        assetFileNames: 'style.[hash].css'
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // Не удаляем console и debugger в production (опционально)
        drop_console: false,
        drop_debugger: false,
      },
      mangle: {
        // Не переименовываем функции WordPress
        reserved: ['wp', 'i18n', '__', 'sprintf', '_x', '_n', '_nx']
      },
      format: {
        comments: false // Удаляем комментарии
      }
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
  },
});

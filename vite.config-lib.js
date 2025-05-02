import path from "node:path";
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader'

const name = "index";

export default defineConfig({
  // base: "/release-timeline/",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('sl-') || tag.startsWith('bflex-'),
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
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name,
      fileName: format => `${name}.${format}.${format === "es" ? "m" : ""}js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        inlineDynamicImports: true,
      },
    },
  },
});

import { fileURLToPath, URL } from "node:url";

import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { createVuePlugin } from "vite-plugin-vue2";

const libraryName = "VueFormElements";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".js", ".mjs", ".vue", ".json"]
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/components/new_index.js"),
      name: libraryName,
      fileName: (format) => `vue-form-elements.${format}.js`
    },
    sourcemap: 'hidden',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "moment", "moment-timezone", "@chantouchsek/validatorjs"],
      output: {
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          moment: "moment",
          "moment-timezone": "moment-timezone",
          "@chantouchsek/validatorjs": "@chantouchsek/validatorjs"
        }
      }
    }
  }
});

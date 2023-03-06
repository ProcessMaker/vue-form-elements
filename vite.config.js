import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { createVuePlugin } from "vite-plugin-vue2";

import { resolve } from "path";

const libraryName = "VueFormElements";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin(), cssInjectedByJsPlugin()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      }
    ],
    extensions: [".js", ".mjs", ".vue", ".json"]
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/components/new_index.js"),
      name: libraryName,
      fileName: (format) => `vue-form-elements.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "moment"],
      output: {
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          moment: "moment"
        }
      }
    }
  }
});

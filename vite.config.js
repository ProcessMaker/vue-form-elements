import { fileURLToPath, URL } from "node:url";

import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import commonjs from "vite-plugin-commonjs";

const libraryName = "VueFormElements";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), commonjs()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      validatorjs: "validatorjs/dist/validator.js"
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
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "vue",
        "moment",
        "moment-timezone",
        "validatorjs",
        "@processmaker/vue-multiselect"
      ],
      output: {
        exports: "named",
        assetFileNames: `vue-form-elements.[ext]`,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          moment: "moment",
          "moment-timezone": "moment-timezone",
          validatorjs: "validatorjs",
          "@processmaker/vue-multiselect": "VueMultiselect"
        }
      }
    }
  }
});

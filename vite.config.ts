import { fileURLToPath, URL } from "node:url";

import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import commonjs from "vite-plugin-commonjs";
import dtsPlugin from "vite-plugin-dts";

const libraryName = "VueFormElements";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    commonjs(),
    dtsPlugin({
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".js", "*.ts", ".mjs", ".vue", ".json"]
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/components/new_index.ts"),
      name: libraryName,
      fileName: (format) => `vue-form-elements.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "moment", "moment-timezone", "@processmaker/vue-multiselect"],
      output: {
        exports: "named",
        assetFileNames: `vue-form-elements.[ext]`,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          moment: "moment",
          "moment-timezone": "moment-timezone",
          "@processmaker/vue-multiselect": "VueMultiselect"
        }
      }
    }
  }
});

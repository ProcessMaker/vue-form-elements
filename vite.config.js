import {defineConfig} from 'vite';
import {createVuePlugin} from 'vite-plugin-vue2';

const path = require('path');

const libraryName = 'VueFormElements';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.js'),
      name: libraryName,
      fileName: (format) => `vue-form-elements.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'moment'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          moment: 'moment',
        }
      }
    }
  }
});

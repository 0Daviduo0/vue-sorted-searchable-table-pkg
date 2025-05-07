// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()], // Abilita il supporto per i file .vue
  build: {
    // Configurazione per la build in modalità libreria
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'), // Punto di ingresso definito prima
      name: 'Table', // Nome globale per UMD (se usato via <script>)
      fileName: (format) => `vue-searchable-sortable-table.${format}.js`, // Nome dei file di output
      formats: ['es', 'umd', 'cjs'] // Formati da generare (ES Module, UMD, CommonJS)
    },
    rollupOptions: {
      // Dipendenze esterne: non includerle nel bundle.
      // Devono essere fornite dal progetto che usa la libreria (definite come peerDependencies).
      external: ['vue', '@heroicons/vue/20/solid'], // Specifica i path esatti usati negli import
      output: {
        // Configurazione per l'output UMD/IIFE
        globals: {
          vue: 'Vue', // Mappa 'vue' alla variabile globale 'Vue'
          '@heroicons/vue/20/solid': 'HeroiconsVue20Solid' // Mappa '@heroicons/vue/20/solid' a un nome globale
        },
        // Poiché il componente usa classi Tailwind, il CSS sarà gestito dal progetto ospitante.
        // Non è necessario estrarre CSS separato dal componente stesso, a meno che tu non abbia stili <style> non-Tailwind.
      }
    },
    // Opzionale: abilita sourcemaps per il debug
    // sourcemap: true,
    // Opzionale: Pulisci la cartella dist prima della build
    // emptyOutDir: true,
  },
});
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcssShortener from '../../dist/vite';

console.log(process.env.USED);
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir:
      process.env.USED === 'false'
        ? 'dist-before'
        : process.env.USED === 'true'
        ? 'dist-after'
        : undefined,
  },
  plugins: [
    vue(),
    process.env.USED === 'true' &&
      tailwindcssShortener({
        tailwindCSS: './src/assets/tailwind.css',
      }),
  ],
});

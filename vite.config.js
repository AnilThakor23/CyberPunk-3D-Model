import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/CyberPunk-3D-Model/', // Replace with your GitHub repository name
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // Ensure this points to your entry file
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@examples': path.resolve(__dirname, '../../examples')
    }
  },
  server: {
    port: 5173,
    fs: {
      allow: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../..')]
    }
  }
});

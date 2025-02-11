import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// Corrected single export
export default defineConfig({
  plugins: [react()],  // Moved plugins inside the single export
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

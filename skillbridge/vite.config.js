import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sih-2026-internal/', // 👈 Add your repository name here with leading and trailing slashes
});
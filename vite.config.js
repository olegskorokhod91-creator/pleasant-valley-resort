import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        plan: resolve(__dirname, 'plan-your-stay.html'),
        reservations: resolve(__dirname, 'reservations.html'),
        weddings: resolve(__dirname, 'weddings.html')
      }
    }
  }
});

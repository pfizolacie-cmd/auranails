import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Komponenty dizajn systému sú .jsx, ale niektoré majú príponu uvedenú v importoch
// explicitne — plugin-react ich spracuje bez ďalšej konfigurácie.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});

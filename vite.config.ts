import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    // safari14 hits an esbuild lowering bug for destructuring that mixes a
    // default value with a rest element (`{ a, b = x, ...rest }`); safari15
    // doesn't need that lowering path.
    target: ["safari15", "chrome90", "firefox90"],
  },
})

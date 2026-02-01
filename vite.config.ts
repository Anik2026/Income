import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid needing @types/node
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Prevent "process is not defined" error in browser
      // Fallback to empty string if undefined to prevent crash
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Fallback for other process accesses if any libs use it
      'process.env': {} 
    }
  };
});
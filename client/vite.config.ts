import { defineConfig } from 'vitest/config';
import reactRefresh from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  server: {
    port: 8080,
  },
  base: './', // Set the base URL to the current directory
  plugins: [
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './setupTests.ts',
    dir: 'src/pages',
  },
});

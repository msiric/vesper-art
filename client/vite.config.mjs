import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import fs from 'node:fs';
const aliases = JSON.parse(fs.readFileSync(new URL('./base-tsconfig.json', import.meta.url))).compilerOptions.paths;
export default defineConfig({
  define: { "process.env.DEMO_MODE": JSON.stringify("true") },
  plugins: [react(), svgr()],
  resolve: { dedupe: ['react', 'react-dom'], alias: Object.fromEntries([
    ...Object.entries(aliases).map(([name, paths]) => [name.replace('/*',''), path.resolve(paths[0].replace('/*',''))]),
    ['yup', path.resolve('node_modules/yup')],
    ['process', path.resolve('src/demo/browser-process.js')],
  ]) },
  server: { host: '127.0.0.1', port: 5175, fs: { allow: ['..'] }, proxy: { '/api': 'http://127.0.0.1:5075', '/auth': 'http://127.0.0.1:5075', '/socket.io': {target:'http://127.0.0.1:5075',ws:true} } },
  build: { outDir: 'build', sourcemap: false },
});

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { entryVitePlugin } from './config/entryVitePlugin';
import { tsServicesPlugin } from './config/tsServicesPlugin';
import { HTMLFileNames } from './src/HTMLFileNames';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tsServicesPlugin()
	],
})

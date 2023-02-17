import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { entryVitePlugin } from './config/entryVitePlugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		entryVitePlugin(),
		vue()
	],
})

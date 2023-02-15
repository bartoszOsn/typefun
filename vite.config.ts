import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL('./index.html', import.meta.url)),
				devTools: fileURLToPath(new URL('./html/devTools.html', import.meta.url)),
			},
		}
	},
	plugins: [vue()],
})

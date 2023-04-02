import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { tsServicesPlugin } from './config/tsServicesPlugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths({ root: __dirname, loose: true}),
		vue(),
		tsServicesPlugin()
	],
})

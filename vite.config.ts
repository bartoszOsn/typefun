import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { entryVitePlugin } from './config/entryVitePlugin';
import { tsServicesPlugin } from './config/tsServicesPlugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		entryVitePlugin([
			{
				name: 'devTools.html',
				appContainer: false,
				scripts: ['./src/entry/devTools.ts']
			},
			{
				name: 'devToolsPanel.html',
				scripts: ['./src/entry/devToolsPanel.ts']
			}
		]),
		vue(),
		tsServicesPlugin()
	],
})

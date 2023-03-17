import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { entryVitePlugin } from './config/entryVitePlugin';
import { tsServicesPlugin } from './config/tsServicesPlugin';
import { HTMLFileNames } from './src/HTMLFileNames';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		entryVitePlugin([
			{
				name: HTMLFileNames.devTools,
				appContainer: false,
				scripts: ['./src/entry/devTools.ts']
			},
			{
				name: HTMLFileNames.devToolsPanel,
				scripts: ['./src/entry/devToolsPanel.ts']
			},
			{
				name: HTMLFileNames.manageScripts,
				scripts: ['./src/entry/manageScripts.ts']
			},
			{
				name: 'shimConsoleContentScript',
				path: './src/entry/shimConsoleContentScript.ts'
			}
		]),
		vue(),
		tsServicesPlugin()
	],
})

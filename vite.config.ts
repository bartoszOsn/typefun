import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { tsServicesPlugin } from './config/tsServicesPlugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { domainEnforcerPlugin } from './config/domainEnforcerPlugin';
import * as Path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths({ root: __dirname, loose: true}),
		vue(),
		tsServicesPlugin(),
		domainEnforcerPlugin([
			{
				name: 'pages',
				path: Path.resolve(__dirname, './src/pages'),
				allowed: ['feature', 'core', 'utils']
			},
			{
				name: 'feature',
				path: Path.resolve(__dirname, './src/feature'),
				allowed: ['core', 'utils']
			},
			{
				name: 'core',
				path: Path.resolve(__dirname, './src/core'),
				allowed: ['utils']
			},
			{
				name: 'utils',
				path: Path.resolve(__dirname, './src/utils'),
				allowed: []
			}
		])
	],
})

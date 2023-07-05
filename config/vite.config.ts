import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { tsServicesPlugin } from './tsServicesPlugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { domainEnforcerPlugin } from './domainEnforcerPlugin';
import checker from 'vite-plugin-checker';
import * as Path from 'path';

const root = Path.resolve(__dirname, '../');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths({ root: root, loose: true}),
		vue(),
		tsServicesPlugin(),
		domainEnforcerPlugin([
			{
				name: 'pages',
				path: Path.resolve(root, './src/pages'),
				allowed: ['feature', 'core', 'utils']
			},
			{
				name: 'feature',
				path: Path.resolve(root, './src/feature'),
				allowed: ['core', 'utils']
			},
			{
				name: 'core',
				path: Path.resolve(root, './src/core'),
				allowed: ['utils']
			},
			{
				name: 'utils',
				path: Path.resolve(root, './src/utils'),
				allowed: []
			}
		]),
		checker({ vueTsc: {
			root: root
		}})
	],
})

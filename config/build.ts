import { build, createLogger } from 'vite';
import * as Path from 'path';
import vue from '@vitejs/plugin-vue';
import * as url from 'url';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { InputOption, OutputOptions } from 'rollup';
import { en } from 'vuetify/locale';
// import { tsServicesPlugin } from './tsServicesPlugin';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

main().then();

async function main() {
	await fs.rm(Path.resolve(__dirname, '../dist'), { recursive: true, force: true });

	const entries = await parseManifest(Path.resolve(__dirname, '../src/manifest.json'));

	console.log('detected entry points:', entries.entries.map(entry => entry.fileName));

	const promises = [];

	for (let entry of entries.entries) {
		const promise = build({
			build: {
				rollupOptions: {
					input: entry.input,
					output: entry.output
				},
				emptyOutDir: false,
			},
			configFile: Path.resolve(__dirname, '../vite.config.ts'),
			customLogger: createLogger(undefined, { prefix: `[${Path.basename(entry.initialValue)}]` }),
			clearScreen: false
		});

		promises.push(promise);
	}

	await Promise.all(promises);
	await fs.writeFile(Path.resolve(__dirname, '../dist/manifest.json'), entries.manifest);
}

interface Manifest {
	entries: Array<Entry>,
	manifest: string
}

interface Entry {
	initialValue: string
	input: InputOption;
	output?: OutputOptions,
	fileName: string;
}
async function parseManifest(manifestPath: string): Promise<Manifest> {
	const manifestObject: object = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

	const entryPoints = getObjectValuesDeep(manifestObject)
		.filter((value): value is string => typeof value === 'string')
		.filter(value => fsSync.existsSync(Path.resolve(Path.dirname(manifestPath), value)));

	const entries: Array<Entry> = entryPoints.map(entryPoint => {
		const isHTML = entryPoint.endsWith('.html');

		const fileName = Path.basename(entryPoint, '.ts') + '.js';
		const input = Path.resolve(Path.dirname(manifestPath), entryPoint);
		return {
			initialValue: entryPoint,
			input: input,
			output: isHTML ? undefined : {
				entryFileNames: fileName,
				format: 'iife'
			},
			fileName: isHTML ? Path.relative(Path.resolve(Path.basename(manifestPath), '..'), input) : fileName
		}
	});

	return {
		entries: entries,
		manifest: JSON.stringify(manifestObject, (key, value) => {
			const entry = entries.find(e => e.initialValue === value);
			if (!entry) {
				return value;
			}
			return entry.fileName;
		}, '\t')
	};
}

export function getObjectValuesDeep(obj: any): Array<unknown> {
	return Object.values(obj).reduce<Array<unknown>>((acc: Array<unknown>, value: unknown) => {
		if (typeof value === 'object' && value !== null) {
			return acc.concat(getObjectValuesDeep(value));
		}
		return acc.concat(value);
	}, []);
}

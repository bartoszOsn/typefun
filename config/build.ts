import { build, createLogger } from 'vite';
import * as Path from 'path';
import * as url from 'url';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { InputOption, OutputOptions } from 'rollup';

const paths = (() => {
	const current = url.fileURLToPath(new URL('.', import.meta.url));

	const base = Path.resolve(current, '..');
	const dist = Path.resolve(base, './dist');
	const manifest = Path.resolve(base, './src/manifest.json');

	return { current, base, dist, manifest };
})();

main().then();

async function main() {
	await fs.rm(paths.dist, { recursive: true, force: true });


	const entries = await parseManifest();

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
			configFile: Path.resolve(paths.current, '../vite.config.ts'),
			customLogger: createLogger(undefined, { prefix: `[${Path.basename(entry.initialValue)}]` }),
			clearScreen: false
		});

		promises.push(promise);
	}

	await Promise.all(promises);
	await fs.writeFile(Path.resolve(paths.dist, './manifest.json'), entries.manifest);
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
async function parseManifest(): Promise<Manifest> {
	const manifestObject: object = JSON.parse(await fs.readFile(paths.manifest, 'utf-8'));

	const entryPoints = getObjectValuesDeep(manifestObject)
		.filter((value): value is string => typeof value === 'string')
		.filter(value => fsSync.existsSync(Path.resolve(Path.dirname(paths.manifest), value)));

	const entries: Array<Entry> = entryPoints.map(entryPoint => entryPointToEntry(Path.resolve(Path.dirname(paths.manifest), entryPoint), entryPoint));

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

export function entryPointToEntry(entryPointAbsolute: string, originalPath: string): Entry {
	const isHTML = entryPointAbsolute.endsWith('.html');

	const fileName = Path.basename(entryPointAbsolute, '.ts') + '.js';
	return {
		initialValue: originalPath,
		input: entryPointAbsolute,
		output: isHTML ? undefined : {
			entryFileNames: fileName,
			format: 'iife'
		},
		fileName: isHTML ? Path.relative(paths.base, entryPointAbsolute) : fileName
	}
}
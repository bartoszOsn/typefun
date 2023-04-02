import * as Path from 'path';
import * as url from 'url';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { build, createLogger, Plugin } from 'vite';
import { InputOption, OutputOptions } from 'rollup';

const paths = (() => {
	const current = url.fileURLToPath(new URL('.', import.meta.url));

	const base = Path.resolve(current, '..');
	const dist = Path.resolve(base, './dist');
	const manifest = Path.resolve(base, './src/manifest.json');

	return { current, base, dist, manifest };
})();

main().then();

async function main(): Promise<void> {
	await fs.rm(paths.dist, { recursive: true, force: true });

	const entries = await parseManifest();

	console.log('detected entry points:', entries.entries.map(entry => entry.fileName));

	const entryManager = new EntryManager(new Set<Entry>(entries.entries));

	await entryManager.handle((entry) => {
		return build({
			build: {
				rollupOptions: {
					input: entry.input,
					output: entry.output
				},
				emptyOutDir: false,
			},
			configFile: Path.resolve(paths.current, '../vite.config.ts'),
			customLogger: createLogger(undefined, { prefix: `[${Path.basename(entry.fileName)}]` }),
			clearScreen: false,
			plugins: [{
				name: 'href-loader',
				resolveId: {
					order: 'pre',
					async handler(id: string, importer: string | undefined) {
						if (id.endsWith('?href')) {
							const path = id.slice(0, -5);
							const referenceId = await this.resolve(path, importer);

							if (!referenceId) {
								throw new Error(`Could not resolve ${path} from ${importer}`);
							}
							return `\0${referenceId.id}?href`;
						}
						return null;
					}
				},
				load(id: string) {
					if (id.startsWith('\0') && id.endsWith('?href')) {
						const path = id.slice(1, -5);
						const entry = entryPointToEntry(path);
						entryManager.add(entry);
						return `export default ${JSON.stringify(entry.fileName)}`;
					}
					return null;
				}

			} as Plugin]
		}).then(() => void 0);
	});
	await fs.writeFile(Path.resolve(paths.dist, './manifest.json'), entries.manifest);
}

interface Manifest {
	entries: Array<Entry>;
	manifest: string;
}

interface Entry {
	initialValue?: string;
	input: InputOption;
	output?: OutputOptions;
	fileName: string;
}
async function parseManifest(): Promise<Manifest> {
	const manifestObject: object = JSON.parse(await fs.readFile(paths.manifest, 'utf-8'));

	const entryPoints = getObjectValuesDeep(manifestObject)
		.filter((value): value is string => typeof value === 'string')
		.filter(value => fsSync.existsSync(Path.resolve(Path.dirname(paths.manifest), value)));

	const entries: Array<Entry> = entryPoints.map(entryPoint => entryPointToEntry(Path.resolve(Path.dirname(paths.manifest), entryPoint), entryPoint));

	return {
		entries,
		manifest: JSON.stringify(manifestObject, (key, value) => {
			const entry = entries.find(e => e.initialValue === value);
			if (!entry) {
				return value;
			}
			return entry.fileName;
		}, '\t')
	};
}

export function getObjectValuesDeep(obj: object): Array<unknown> {
	return Object.values(obj).reduce<Array<unknown>>((acc: Array<unknown>, value: unknown) => {
		if (typeof value === 'object' && value !== null) {
			return acc.concat(getObjectValuesDeep(value));
		}
		return acc.concat(value);
	}, []);
}

export function entryPointToEntry(entryPointAbsolute: string, originalPath?: string): Entry {
	const isHTML = entryPointAbsolute.endsWith('.html');

	const fileName = `${Path.basename(entryPointAbsolute, '.ts')  }.js`;
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

export class EntryManager {
	private handler: ((entry: Entry) => Promise<void>) | null = null;
	private resolvePromise: (() => void) | null = null;

	constructor(private readonly entries: Set<Entry>) {
	}

	add(entry: Entry): void {
		if (this.entries.has(entry)) {
			return;
		}

		this.resolve(entry);
	}

	handle(handler: (entry: Entry) => Promise<void>): Promise<void> {
		if (this.handler) {
			throw new Error('handle() method can be only invoked once.');
		}
		this.handler = handler;

		for (const entry of Array.from(this.entries)) {
			this.resolve(entry);
		}

		return new Promise<void>((resolve) => {
			this.resolvePromise = resolve;
		});
	}

	private resolve(entry: Entry): void {


		this.handler?.(entry)
			.then(() => {
				this.entries.delete(entry);
				if (this.entries.size === 0) {
					this.resolvePromise?.();
				}
			});
	}
}

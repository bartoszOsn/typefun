import { Plugin, UserConfig } from 'vite';
import { LoadResult, ResolveIdResult } from 'rollup';
import { HTMLFileName, HTMLFileNames } from '../src/HTMLFileNames';
import * as path from 'path';

export type HTMLEntryVitePluginEntrypoint = {
	name: HTMLFileName;
	scripts: Array<string>;
	appContainer?: false;
}

export type TSEntryVitePluginEntrypoint = {
	name: string;
	path: string;
}

export type EntryVitePluginEntrypoint = HTMLEntryVitePluginEntrypoint | TSEntryVitePluginEntrypoint;

export function entryVitePlugin(entrypoints: Array<EntryVitePluginEntrypoint> ): Plugin {
	const pluginName = 'entry-vite-plugin';

	const nameToEntrypoint = new Map(entrypoints.map(entrypoint => [entrypoint.name, entrypoint]));

	return {
		name: pluginName,

		config(): UserConfig {
			return {
				build: {
					rollupOptions: {
						input: getInput(entrypoints)
					}
				}
			}
		},

		resolveId(id: string, importer: string | undefined, options): ResolveIdResult {
			if (!options.isEntry) {
				return null;
			}

			const entrypoint = nameToEntrypoint.get(id);

			if (!entrypoint) {
				return null;
			}

			const meta = {
				[pluginName]: {
					entrypoint
				}
			}

			if (isTSEntryVitePluginEntrypoint(entrypoint)) {
				return {
					id: entrypoint.path,
					meta: meta
				};
			}

			return { id, meta };
		},

		load(id: string): LoadResult {
			if (!(isHTMLFileName(id) && nameToEntrypoint.has(id))) {
				return null;
			}

			const entrypoint = entrypoints.find(entrypoint => entrypoint.name === id);

			if (!entrypoint || !isHTMLEntryVitePluginEntrypoint(entrypoint)) {
				return null;
			}

			return template(entrypoint);
		},

		generateBundle(options, bundle): void {
			for (const [name, chunk] of Object.entries(bundle)) {

				if (chunk.type !== 'chunk') {
					continue;
				}

				let entrypoint: EntryVitePluginEntrypoint | undefined;

				for (let moduleId of chunk.moduleIds) {
					entrypoint = entrypoints.find(
						entrypoint => isTSEntryVitePluginEntrypoint(entrypoint) && entrypoint.path === moduleId
					);

					if (entrypoint) {
						break;
					}
				}


				if (!entrypoint) {
					continue;
				}

				delete bundle[name];
				const filename = entrypoint.name + path.extname(name);
				bundle[filename] = {
					...chunk,
					fileName: filename
				};
			}
		}
	}
}

function template(entrypoint: HTMLEntryVitePluginEntrypoint): string {
	const name = entrypoint.name.split('.')[0];
	let body = '';

	if (entrypoint.appContainer !== false) {
		body = '<div id="app"></div>\n';
	}

	body += entrypoint.scripts.map(script => `<script src="${script}" type="module"></script>`).join('\n');

	return `<!DOCTYPE html>
	<html>
		<head>
			<title>${name}</title>
		</head>
		<body>
			${ body }
		</body>
	</html>`;
}

function getInput(entrypoints: Array<EntryVitePluginEntrypoint>): Record<string, string> {
	const input: Record<string, string> = {};

	for (const entrypoint of entrypoints) {
		input[entrypoint.name] = entrypoint.name;
	}

	return input;
}

function isHTMLFileName(id: string): id is HTMLFileName {
	return Object.values(HTMLFileNames).includes(id as HTMLFileName);
}

function isHTMLEntryVitePluginEntrypoint(entrypoint: EntryVitePluginEntrypoint): entrypoint is HTMLEntryVitePluginEntrypoint {
	return isHTMLFileName(entrypoint.name) && 'scripts' in entrypoint && Array.isArray(entrypoint.scripts);
}

function isTSEntryVitePluginEntrypoint(entrypoint: EntryVitePluginEntrypoint): entrypoint is TSEntryVitePluginEntrypoint {
	return 'path' in entrypoint && typeof entrypoint.path === 'string';
}

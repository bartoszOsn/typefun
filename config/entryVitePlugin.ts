import { Plugin, UserConfig } from 'vite';
import { LoadResult, ResolveIdResult } from 'rollup';

export interface EntryVitePluginEntrypoint {
	name: `${string}.html`;
	scripts: Array<string>;
	appContainer?: false
}

export function entryVitePlugin(entrypoints: Array<EntryVitePluginEntrypoint> ): Plugin {
	const files = new Set(entrypoints.map(entrypoint => entrypoint.name));

	return {
		name: 'entry-vite-plugin',

		config(): UserConfig {
			return {
				build: {
					rollupOptions: {
						input: getInput(entrypoints)
					}
				}
			}
		},

		resolveId(id: string, importer: string): ResolveIdResult {
			if (hasHTMLExtension(id) && files.has(id)) {
				return id;
			}

			return null;
		},

		load(id: string): LoadResult {
			if (!(hasHTMLExtension(id) && files.has(id))) {
				return null;
			}

			const entrypoint = entrypoints.find(entrypoint => entrypoint.name === id);

			return template(entrypoint);
		}
	}
}

function template(entrypoint: EntryVitePluginEntrypoint): string {
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

function hasHTMLExtension(id: string): id is `${string}.html` {
	return id.endsWith('.html');
}
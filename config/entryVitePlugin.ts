import { Plugin, UserConfig } from 'vite';
import { LoadResult, ResolveIdResult } from 'rollup';

export function entryVitePlugin(): Plugin {
	const SUFFIX = '.entry.html';

	return {
		name: 'entry-vite-plugin',

		config(config: UserConfig, env: { mode: string, command: string }): UserConfig {
			return {
				build: {
					rollupOptions: {
						input: {
							devToolsPanel: EntryType.devToolsPanel + SUFFIX,
							devTools: EntryType.DevTools + SUFFIX,
						},
						// external: ['node_modules/typescript/lib/typescriptServices.js']
					}
				}
			}
		},

		resolveId(id: string, importer: string): ResolveIdResult {
			if (id.endsWith(SUFFIX)) {
				return id;
			}

			return null;
		},

		load(id: string): LoadResult {
			if (!id.endsWith(SUFFIX)) {
				return null;
			}

			const type = id.slice(0, -SUFFIX.length);

			if (!isEntryType(type)) {
				throw new Error(`Invalid entry type: ${type}`);
			}

			return template(type);
		}
	}
}

enum EntryType {
	DevTools = 'devTools',
	devToolsPanel = 'devToolsPanel',
}

function isEntryType(type: string): type is EntryType {
	return Object.values(EntryType).includes(type as EntryType);
}

function template(type: EntryType): string {
	let body = '';

	if (type === EntryType.DevTools) {
		body = '<script src="./src/entry/devTools.ts" type="module"></script>';
	} else if (type === EntryType.devToolsPanel) {
		body = '<div id="app"></div>\n' +
			'<script src="./node_modules/typescript/lib/typescriptServices.js" type="application/javascript"></script>\n' +
			'<script src="./src/entry/devToolsPanel.ts" type="module"></script>';
	}

	return `<!DOCTYPE html>
	<html>
		<head>
			<title>${type}</title>
		</head>
		<body>
			${ body }
		</body>
	</html>`;
}
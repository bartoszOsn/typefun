import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { Plugin } from 'vite';
import { LoadResult, ResolveIdResult } from 'rollup';

export function tsServicesPlugin(): Plugin {
	// const RESOLVE_ID = 'node_modules/typescript/lib/typescriptServices.js';
	const RESOLVE_ID = 'ts-services';

	return {
		name: 'ts-services-plugin',

		resolveId(id: string): ResolveIdResult {
			if (id === RESOLVE_ID) {
				return id;
			}

			return null;
		},

		async load(id: string): Promise<LoadResult> {
			if(id !== RESOLVE_ID) {
				return null;
			}

			const tsSevicesFilePath = resolve('node_modules/typescript/lib/typescriptServices.js');
			const tsServices = await readFile(tsSevicesFilePath, 'utf-8');

			return `${tsServices
			}\nexport { ts };`;
		}
	}
}

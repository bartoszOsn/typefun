import { resolve } from 'path';

export interface StateDirectoryDescriptor {
	versions: string;
	anyVersionsFile: string;
	versionsTuple: string;
}

export function normalizeStateDescriptor(descriptor: StateDirectoryDescriptor, path: string): StateDirectoryDescriptor {
	return {
		versions: resolve(path, '..', descriptor.versions),
		anyVersionsFile: resolve(path, '..', descriptor.anyVersionsFile),
		versionsTuple: descriptor.versionsTuple
	};
}
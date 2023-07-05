import { normalizeStateDescriptor, StateDirectoryDescriptor } from './StateDirectoryDescriptor.js';
import { getFiles, readJson } from './utils.js';
import { resolve } from 'path';
import { GitManager } from './GitManager.js';
import { lintforDescriptor } from './lintforDescriptor.js';

main().then();

async function main(): Promise<void> {
	const gitManager = new GitManager();
	const descriptors = await getStateDescriptors();

	for (let descriptor of descriptors) {
		await lintforDescriptor(descriptor, gitManager);
	}
}

async function getStateDescriptors(): Promise<StateDirectoryDescriptor[]> {
	const descriptorFiles = await getFiles(process.cwd())
		.then(files => files.filter(file => file.endsWith('.stateversions.json')));

	return Promise.all(descriptorFiles.map(async file => {
		const absolutePath = resolve(process.cwd(), file);
		const descriptor = await readJson<StateDirectoryDescriptor>(absolutePath);
		return normalizeStateDescriptor(descriptor, absolutePath);
	}));
}

import { normalizeStateDescriptor, StateDirectoryDescriptor } from './StateDirectoryDescriptor.js';
import { getFiles, readJson } from './utils.js';
import { resolve } from 'path';
import { GitManager } from './GitManager.js';
import { lintforDescriptor } from './lintforDescriptor.js';

main()
	.catch(error => {
		console.error(error);
		process.exit(1);
	})
	.then();

async function main(): Promise<void> {
	const baseCommit = process.argv[2];
	const headCommit = process.argv[3];

	console.log(`Linting state changes between ${baseCommit} and ${headCommit}`);

	const gitManager = new GitManager(baseCommit, headCommit);
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

import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { ESLint } from 'eslint';
import { GitManager } from './GitManager.js';
import { StateDirectoryDescriptor } from './StateDirectoryDescriptor.js';
import LintResult = ESLint.LintResult;

export async function lintforDescriptor(descriptor: StateDirectoryDescriptor, gitManager: GitManager): Promise<void> {
	await verifyNoModifiedState(descriptor, gitManager);
	await verifyAllStatesInStateTuple(descriptor);
}

async function verifyNoModifiedState(descriptor: StateDirectoryDescriptor, gitManager: GitManager): Promise<void> {
	const modifiedFiles = await gitManager.filesModifiedInDirectory(descriptor.versions);
	if (modifiedFiles.length > 0) {
		throw new Error(
			`File in directory ${descriptor.versions} has been modified in last commit.\n' +
			'${modifiedFiles.join('\n')}\n' +
			'DO NOT MODIFY EXISTING STATE INTERFACES!\n` +
			'Create a new one instead.'
		)
	}
}

async function verifyAllStatesInStateTuple(descriptor: StateDirectoryDescriptor): Promise<void> {
	const stateFiles = new Set(
		(await readdir(descriptor.versions))
			.map(fileName => resolve(descriptor.versions, fileName))
	);

	const eslint = new ESLint({
		baseConfig: {
			rules: {
				'all-states-in-state-tuple': ['error', {
					stateTuple: descriptor.versionsTuple,
					stateDirectory: descriptor.versions,
					stateFiles
				}]
			},
			parser: '@typescript-eslint/parser'
		},
		rulePaths: [ resolve(process.cwd(), 'config/state-lint/rules')],
		useEslintrc: false
	});

	const result: LintResult = (await eslint.lintFiles(descriptor.anyVersionsFile))[0];

	if (result.messages.length > 0) {
		throw new Error(result.messages.map(message => message.message).join('\n'));
	}
}

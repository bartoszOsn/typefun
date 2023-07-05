import { resolve } from 'path';
import { execAsync } from './utils.js';

export class GitManager {
	private commitLog: Array<FileEntry> | null = null;

	constructor(
		private readonly baseCommit: string,
		private readonly headCommit: string
	) {}

	async filesModifiedInDirectory(directory: string): Promise<Array<string>> {
		const fileEntries = await this.getCommitLog();

		const modifiedFiles = fileEntries
			.filter(fileEntry => fileEntry.type === 'M' && fileEntry.path.startsWith(directory))
			.map(fileEntry => fileEntry.path);

		return modifiedFiles;
	}

	private async getCommitLog(): Promise<Array<FileEntry>> {
		if (this.commitLog === null) {
			this.commitLog = await this.loadCommitLog();
		}

		return this.commitLog;
	}

	private async loadCommitLog(): Promise<Array<FileEntry>> {
		const gitRoot = (await execAsync('git rev-parse --show-toplevel')).trim();

		console.log('branches', await execAsync('git branch -a'))

		const bashOutput =
			await execAsync(`git --no-pager diff ${this.baseCommit}..${this.headCommit} --name-status`);
		return bashOutput.split('\n')
			.filter(line => line.startsWith('M\t') || line.startsWith('A\t') || line.startsWith('D\t'))
			.map(line => line.split('\t') as ['M' | 'A' | 'D', string])
			.map(([type, path]: ['M' | 'A' | 'D', string]): FileEntry => ({ type, path: resolve(gitRoot, path) }));
	}
}

export interface FileEntry {
	path: string;
	type: 'M' | 'A' | 'D';
}

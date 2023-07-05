import { execAsync } from './utils.js';
import { resolve } from 'path';

export class GitManager {
	private commitLog: Array<FileEntry> | null = null;

	constructor(
		private readonly baseCommit: string,
		private readonly headCommit: string
	) {}

	async anyFileModifiedInDirectory(directory: string): Promise<boolean> {
		const fileEntries = await this.getCommitLog();

		for (let fileEntry of fileEntries) {
			if (fileEntry.type === 'M' && fileEntry.path.startsWith(directory)) {
				return true;
			}
		}

		return false;
	}

	private async getCommitLog(): Promise<Array<FileEntry>> {
		if (this.commitLog === null) {
			this.commitLog = await this.loadCommitLog();
		}

		return this.commitLog;
	}

	private async loadCommitLog(): Promise<Array<FileEntry>> {
		const gitRoot = (await execAsync('git rev-parse --show-toplevel')).trim();

		const bashOutput =
			await execAsync(`git --no-pager diff ${this.baseCommit}..${this.headCommit} --name-status`);
		return bashOutput.split('\n')
			.filter(line => line.startsWith('M\t') || line.startsWith('A\t') || line.startsWith('D\t'))
			.map(line => line.split('\t') as ['M' | 'A' | 'D', string])
			.map(([type, path]: ['M' | 'A' | 'D', string]): FileEntry => ({type, path: resolve(gitRoot, path)}));
	}
}

export interface FileEntry {
	path: string;
	type: 'M' | 'A' | 'D';
}

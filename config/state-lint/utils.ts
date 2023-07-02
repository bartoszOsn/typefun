import { readdir, stat, readFile } from 'node:fs/promises';
import { resolve } from 'path';
import { exec } from 'child_process';

export async function getFiles(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(subdirs.map(async (subdir) => {
		const res = resolve(dir, subdir);
		return (await stat(res)).isDirectory() ? getFiles(res) : res;
	}));
	return files.reduce((a, f) => a.concat(f), []);
}

export async function readJson<TFile extends {}>(path: string): Promise<TFile> {
	const file = (await readFile(path)).toString();
	return JSON.parse(file);
}

export function execAsync(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}

			if (stderr) {
				reject(stderr);
				return;
			}

			resolve(stdout);
		});
	});
}
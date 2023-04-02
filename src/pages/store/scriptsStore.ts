import { defineStore } from 'pinia';

export interface Script {
	name: string;
	id: number;
	urlPattern: string;
}

export const scriptsStoreId = 'scripts';

export const useScriptsStore = defineStore(scriptsStoreId, {
	state: () => ({
		scripts: [
			{ id: 0, name: 'Hello World!', urlPattern: 'google.com/.*' },
			{ id: 1, name: 'Remove 3rd col', urlPattern: 'https://www.reddit.com/.*' },
			{ id: 2, name: 'web crawler', urlPattern: 'https://www.wiki.org/.*' },
		] as Array<Script>,
	}),

	actions: {
		addScript(_script: string, _urlPattern: string) {
			// this.scripts.push(script);
		}
	},
	sync: true
});

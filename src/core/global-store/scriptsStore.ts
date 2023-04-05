import { defineStore } from 'pinia';

export interface Script {
	name: string;
	id: number;
	urlPattern: string;
}

export const scriptsStoreId = 'scripts';

const initialState = {
	scripts: [
		{ id: 0, name: 'Hello World!', urlPattern: 'google.com/.*' },
		{ id: 1, name: 'Remove 3rd col', urlPattern: 'https://www.reddit.com/.*' },
		{ id: 2, name: 'web crawler', urlPattern: 'https://www.wiki.org/.*' },
	] as Array<Script>,
}

export const useScriptsStore = defineStore(scriptsStoreId, {
	state: () => ({ ...initialState }),

	actions: {
		addScript(name: string, urlPattern: string) {
			this.scripts.push({
				id: this.scripts.length,
				name: name,
				urlPattern: urlPattern
			});
		},
		resetState() {
			this.$reset();
		}
	},
	sync: true
});

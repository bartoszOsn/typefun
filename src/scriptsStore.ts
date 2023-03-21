import { defineStore } from 'pinia';

export interface ScriptName {
	name: string;
	id: number;
}

export const useScriptsStore = defineStore('scripts', {
	state: () => ({
		scripts: ['Hello world!', 'Remove 3rd column', 'webcrawler'] as string[],
	}),

	getters: {
		scriptNames(state): Array<ScriptName> {
			return state.scripts.map((script, index) => ({name: script, id: index}));
		}
	},

	actions: {

	}

});
import { defineStore } from 'pinia';

export interface ScriptName {
	name: string;
	id: number;
}

export const scriptsStoreId = 'scripts';

export const useScriptsStore = defineStore(scriptsStoreId, {
	state: () => ({
		scripts: ['Hello world!', 'Remove 3rd column', 'webcrawler'] as string[],
	}),

	getters: {
		scriptNames(state): Array<ScriptName> {
			return state.scripts?.map((script, index) => ({name: script, id: index})) ?? [];
		}
	},

	actions: {
		addScript(script: string, urlPattern: string) {
			this.scripts.push(script);
		}
	}

});
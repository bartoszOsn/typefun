import { defineStore } from 'pinia';

export interface Script {
	id: number;
	name: string;
	urlPattern: string;
}

export const scriptsStoreId = 'scripts';

const initialState = {
	nextScriptId: 1,
	scripts: [
		{
			id: 0,
			name: 'Hello World!',
			urlPattern: 'google.com/.*'
		}
	] as Array<Script>,
}

export const useScriptsStore = defineStore(scriptsStoreId, {
	state: () => ({ ...initialState }),

	actions: {
		addScript(name: string, urlPattern: string) {
			this.$patch((state) => {
				state.scripts.push({
					id: state.nextScriptId,
					name: name,
					urlPattern: urlPattern
				});
				state.nextScriptId++;
			});
		},
		resetState() {
			this.$reset();
		}
	},
	sync: true
});

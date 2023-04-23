import { defineStore } from 'pinia';
import { compileTs } from '../ts-compilator/compileTs';

export interface Script {
	id: number;
	name: string;
	urlPattern: string;
	code: {
		raw: string;
		compiled: string;
		draft: string;
		modified: boolean;
	}
}

export const scriptsStoreId = 'scripts';

const initialState = {
	nextScriptId: 1,
	scripts: [
		{
			id: 0,
			name: 'Hello World!',
			urlPattern: 'google.com/.*',
			code: {
				raw: '',
				compiled: '',
				draft: '',
				modified: false
			}
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
					urlPattern: urlPattern,
					code: {
						raw: '',
						compiled: '',
						draft: '',
						modified: false
					}
				});
				state.nextScriptId++;
			});
		},
		setCode(scriptId: number, code: string) {
			this.$patch((state) => {
				const script = state.scripts.find(script => script.id === scriptId);
				if (script) {
					script.code.draft = code;
					script.code.modified = script.code.draft !== script.code.raw;
				}
			});
		},
		saveCurrentScript(scriptId: number) {
			this.$patch((state) => {
				const script = state.scripts.find(script => script.id === scriptId);
				if (script) {
					script.code.raw = script.code.draft;
					script.code.compiled = compileTs(script.code.raw);
					script.code.modified = false;
				}
			});
		},
		revertCode(scriptId: number) {
			this.$patch((state) => {
				const script = state.scripts.find(script => script.id === scriptId);
				console.log('revertCode0', scriptId, script);
				if (script) {
					console.log('revertCode1', scriptId, script);
					script.code.draft = script.code.raw;
					script.code.modified = false;
				}
			});
		},
		resetState() {
			this.$reset();
		}
	},
	sync: true
});

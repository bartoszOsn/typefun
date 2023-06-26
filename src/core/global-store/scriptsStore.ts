import { defineStore } from 'pinia';
import { compileTs } from '../ts-compilator/compileTs';
import { ScriptsStoreState } from './ScriptsStoreState';
import { scriptsStoreId } from './scriptsStoreId';

const initialState: ScriptsStoreState = {
	version: 2,
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
	],
}

export const useScriptsStore = defineStore(scriptsStoreId, {
	state: () => ({ ...initialState }),

	getters: {
		getScriptById: (state) => (scriptId: number) => {
			return state.scripts.find(script => script.id === scriptId);
		}
	},

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
		removeScript(scriptId: number) {
			this.$patch((state) => {
				state.scripts = state.scripts.filter(script => script.id !== scriptId);
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
		editScriptMeta(scriptId: number, name: string, urlPattern: string) {
			this.$patch((state) => {
				const script = state.scripts.find(script => script.id === scriptId);
				if (script) {
					script.name = name;
					script.urlPattern = urlPattern;
				}
			});
		},
		resetState() {
			this.$reset();
		},
		addIgnoresToScript(scriptId: number, lineNumbers: number[]) {
			const script = this.getScriptById(scriptId);
			if (!script) {
				return;
			}

			const reverseSortedLines = Array.from(new Set(lineNumbers))
											.sort((a, b) => (a - b) * -1);
			const lines = script.code.draft.split('\n');
			for (const lineNumber of reverseSortedLines) {
				lines.splice(lineNumber-1, 0, '// @ts-ignore');
			}
			script.code.draft = lines.join('\n');
		}
	},
	sync: true
});

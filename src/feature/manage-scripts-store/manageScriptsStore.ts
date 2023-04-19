import { defineStore } from 'pinia';
import browser from 'webextension-polyfill';
import { useScriptsStore } from '@/core/global-store/scriptsStore';

export const useManageScriptsStore = defineStore('manageScriptsStore', {
	state: () => ({
		currentScriptId: null as number | null,
	}),

	getters: {
		currentScript(state) {
			return useScriptsStore().scripts.find(script => script.id === state.currentScriptId);
		}
	},

	actions: {
		setCode(code: string) {
			const scriptsStore = useScriptsStore();

			if (this.currentScriptId === null) {
				throw new Error('No script is selected');
			}

			scriptsStore.setCode(this.currentScriptId, code);
		},
		saveCode() {
			const scriptsStore = useScriptsStore();

			if (this.currentScriptId === null) {
				throw new Error('No script is selected');
			}

			scriptsStore.saveCode(this.currentScriptId);
		}
	}
});
import { defineStore } from 'pinia';
import browser from 'webextension-polyfill';
import { useScriptsStore } from '@/core/global-store/scriptsStore';

export const useDevToolsPanelStore = defineStore('devToolsPanel', {
	state: () => ({
		inspectedWindowUrl: '',
		currentScriptId: null as number | null
	}),

	getters: {
		applicableScripts(state) {
			const scriptsStore = useScriptsStore();

			return scriptsStore.scripts.filter(script => new RegExp(script.urlPattern).test(state.inspectedWindowUrl));
		},
		currentScript(state) {
			const scriptsStore = useScriptsStore();

			return scriptsStore.scripts.find(script => script.id === state.currentScriptId);
		},
		showNoApplicableScriptSplashScreen(): boolean {
			return this.applicableScripts.length === 0;
		}
	},

	actions: {
		async setInitialInspectedWindowUrl() {
			const tab = await browser.tabs.get(browser.devtools.inspectedWindow.tabId);
			this.inspectedWindowUrl = tab.url ?? '';
		},
		setInspectedWindowUrl(url: string) {
			this.inspectedWindowUrl = url;
		},
		setCurrentScriptId(scriptId: number) {
			this.currentScriptId = scriptId;
		},
		setFirstApplicableScriptAsCurrent() {
			const applicableScripts = this.applicableScripts;
			if (applicableScripts.length > 0) {
				this.currentScriptId = applicableScripts[0].id;
			}
		}
	}
});

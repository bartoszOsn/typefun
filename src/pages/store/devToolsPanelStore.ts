import { defineStore } from 'pinia';
import browser from 'webextension-polyfill';
import { useScriptsStore } from './scriptsStore';

export const useDevToolsPanelStore = defineStore('devToolsPanel', {
	state: () => ({
		inspectedWindowUrl: '',
	}),

	getters: {
		applicableScripts(state) {
			const scriptsStore = useScriptsStore();

			return scriptsStore.scripts.filter(script => new RegExp(script.urlPattern).test(state.inspectedWindowUrl));
		}
	},

	actions: {
		async setInitialInspectedWindowUrl() {
			const tab = await browser.tabs.get(browser.devtools.inspectedWindow.tabId);
			this.inspectedWindowUrl = tab.url ?? '';
		},
		setInspectedWindowUrl(url: string) {
			this.inspectedWindowUrl = url;
		}
	}
});

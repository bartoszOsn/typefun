import browser from 'webextension-polyfill';
import { useDevToolsPanelStore } from './devToolsPanelStore';

export function useListenToUrl(): void {
	const store = useDevToolsPanelStore();

	store.setInitialInspectedWindowUrl();

	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (tabId !== browser.devtools.inspectedWindow.tabId || !changeInfo.url) {
			return;
		}
		store.setInspectedWindowUrl(tab.url ?? '');
	});
}

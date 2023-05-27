import { ScriptsStoreState } from './ScriptsStoreState';
import browser from 'webextension-polyfill';
import { scriptsStoreId } from './scriptsStoreId';

export function loadScriptsStoreStateFromStorage(): Promise<ScriptsStoreState> {
	return browser.storage.local.get(scriptsStoreId)
		.then(globalState => globalState[scriptsStoreId]) as Promise<ScriptsStoreState>;
}
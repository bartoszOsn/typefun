import browser from 'webextension-polyfill';
import { loadScriptsStoreStateFromStorage } from '../../global-store/loadScriptsStoreStateFromStorage';
import { isExecuteScriptMessage } from '../ExecuteScriptMessage';
import { executeScriptInContentScript } from './executeScriptInContentScript';

export {};

(async function() {
	listenForScriptExecutionRequests();
	const scriptsState = await loadScriptsStoreStateFromStorage();
	const url = window.location.href;
	const scripts = scriptsState.scripts.filter(script => new RegExp(script.urlPattern).test(url));

	if (scripts.length === 0) {
		return;
	}

	for (const script of scripts) {
		executeScriptInContentScript(script.code.compiled);
	}
})().then();

function listenForScriptExecutionRequests() {
	browser.runtime.onMessage.addListener((message) => {
		if (isExecuteScriptMessage(message)) {
			executeScriptInContentScript(message.script);
		}
	});
}

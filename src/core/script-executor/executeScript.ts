import browser from 'webextension-polyfill';
import { ExecuteScriptMessage } from '@/core/script-executor/ExecuteScriptMessage';

export async function executeScript(script: string, tabId: number): Promise<void> {
	const message: ExecuteScriptMessage = {
		type: 'execute-script',
		script
	};

	return browser.tabs.sendMessage(tabId, message);
}

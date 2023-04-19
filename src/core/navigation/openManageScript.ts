import browser from 'webextension-polyfill';
import manageScriptsUrl from '../../pages/manage-scripts/manageScripts.html?href';

export function openManageScript(): void {
	browser.tabs.create({
		url: manageScriptsUrl
	});
}

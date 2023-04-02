import browser from 'webextension-polyfill';
import { HTMLFileNames } from '../HTMLFileNames';
import devToolsPanelUrl from '../html/devToolsPanel.html?href';

export {};

browser.devtools.panels.create(
	'Editor',                      		// title
	'/vite.svg',	               			// icon
	devToolsPanelUrl	// content
)
	.then(() => {
		// newPanel.onShown.addListener(initialisePanel);
		// newPanel.onHidden.addListener(unInitialisePanel);
	});

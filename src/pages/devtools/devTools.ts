import browser from 'webextension-polyfill';
import devToolsPanelUrl from '../devtools-panel/devToolsPanel.html?href';

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

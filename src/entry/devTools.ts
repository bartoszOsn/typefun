import browser from 'webextension-polyfill';
import { HTMLFileNames } from '../HTMLFileNames';

export {};

browser.devtools.panels.create(
	'Editor',                      		// title
	'/vite.svg',	               			// icon
	`../${HTMLFileNames.devToolsPanel}`	// content
)
	.then(() => {
		// newPanel.onShown.addListener(initialisePanel);
		// newPanel.onHidden.addListener(unInitialisePanel);
});

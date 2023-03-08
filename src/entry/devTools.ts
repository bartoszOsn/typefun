import { getExtensionApi } from '../utils/extensionApi';

export {};

getExtensionApi().devtools.panels.create(
	'Editor',                      // title
	'/vite.svg',	               // icon
	'../devToolsPanel.html'		   // content
)
	// .then(() => {
		// newPanel.onShown.addListener(initialisePanel);
		// newPanel.onHidden.addListener(unInitialisePanel);
// });

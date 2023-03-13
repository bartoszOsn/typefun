import { getExtensionApi } from '../utils/extensionApi';
import { HTMLFileNames } from '../HTMLFileNames';

export {};

getExtensionApi().devtools.panels.create(
	'Editor',                      		// title
	'/vite.svg',	               			// icon
	`../${HTMLFileNames.devToolsPanel}`	// content
)
	// .then(() => {
		// newPanel.onShown.addListener(initialisePanel);
		// newPanel.onHidden.addListener(unInitialisePanel);
// });

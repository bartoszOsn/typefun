import type { ConsoleEvent } from '../utils/shimConsole';
import type { ExtensionApi } from '../utils/extensionApi';

// This is a content script that is injected into every page.
// it cannot have any dependencies on other files, because they will not be available.
// All it can import is types.
function getExtensionApi(): ExtensionApi {
	if (typeof browser !== "undefined") {
		return browser;
	}
	else if (typeof chrome !== "undefined") {
		return chrome;
	}

	throw new Error('Could not find extension API.');
}

const eventName = 'console-event';

const pageScript = document.createElement('script');
pageScript.src = getExtensionApi().runtime.getURL('shimConsolePageScript.js');
document.head.appendChild(pageScript);

interface ConsoleEventEvent extends Event {
	detail: ConsoleEvent
}

document.addEventListener(eventName, (event) => {
	const consoleEvent = (event as ConsoleEventEvent).detail;
	console.log('dispatchConsoleEvent', consoleEvent);
	getExtensionApi().runtime.sendMessage({
		name: 'console-event',
		event: consoleEvent
	});
});

// import type { ConsoleEvent } from '../utils/shimConsole';
// import type { ExtensionApi } from '../utils/extensionApi';
//
// export {};
//
// // This is a content script that is injected into every page.
// // it cannot have any dependencies on other files, because they will not be available.
// // All it can import is types.
// function getExtensionApi(): ExtensionApi {
// 	if (typeof browser !== "undefined") {
// 		return browser;
// 	}
// 	else if (typeof chrome !== "undefined") {
// 		return chrome;
// 	}
//
// 	throw new Error('Could not find extension API.');
// }
//
// (() => {
// 	const oldConsole = {
// 		log: console.log,
// 		info: console.info,
// 		warn: console.warn,
// 		error: console.error
// 	}
//
// 	function dispatchConsoleEvent(eventType: ConsoleEvent['eventType'], args: Array<unknown>) {
// 		oldConsole.log('dispatchConsoleEvent', eventType, args);
// 		getExtensionApi().runtime.sendMessage({
// 			name: 'console-event',
// 			event: args.join(', ')
// 		});
// 	}
//
// 	console.log = (...args: any[]) => {
// 		oldConsole.log(...args);
// 		dispatchConsoleEvent('log', args);
// 	}
//
// 	console.info = (...args: any[]) => {
// 		oldConsole.info(...args);
// 		dispatchConsoleEvent('info', args);
// 	}
//
// 	console.warn = (...args: any[]) => {
// 		oldConsole.warn(...args);
// 		dispatchConsoleEvent('warn', args);
// 	}
//
// 	console.error = (...args: any[]) => {
// 		oldConsole.error(...args);
// 		dispatchConsoleEvent('error', args);
// 	}
//
// 	window.addEventListener('error', (event) => {
// 		dispatchConsoleEvent('exception', [event.error.message, '\n' + event.error.stack]);
// 	});
//
// 	console.log('console shimmed');
// })();


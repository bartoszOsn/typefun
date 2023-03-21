// This is a content script that is injected into every page.
// it cannot have any dependencies on other files, because they will not be available.
// All it can import is types.
import type { ConsoleEvent } from '../utils/shimConsole';
import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

const eventName = 'console-event';

const pageScript = document.createElement('script');
pageScript.src = browser.runtime.getURL('shimConsolePageScript.js');
document.head.appendChild(pageScript);

interface ConsoleEventEvent extends Event {
	detail: ConsoleEvent;
}

document.addEventListener(eventName, (event) => {
	const consoleEvent = (event as ConsoleEventEvent).detail;
	console.log('dispatchConsoleEvent', consoleEvent);
	browser.runtime.sendMessage({
		name: 'console-event',
		event: consoleEvent
	});
});

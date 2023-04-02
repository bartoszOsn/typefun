// This is a content script that is injected into every page.
// it cannot have any dependencies on other files, because they will not be available.
// All it can import is types.
// TODO: Now imports are possible, it is compiled to iife now. Refactor to use imports.
import browser from 'webextension-polyfill';
import type { ConsoleEvent } from '../utils/shimConsole';

const eventName = 'console-event';

const pageScript = document.createElement('script');
pageScript.src = browser.runtime.getURL('shimConsolePageScript.js');
document.head.appendChild(pageScript);

interface ConsoleEventEvent extends Event {
	detail: ConsoleEvent;
}

document.addEventListener(eventName, (event) => {
	const consoleEvent = (event as ConsoleEventEvent).detail;
	browser.runtime.sendMessage({
		name: 'console-event',
		event: consoleEvent
	});
});

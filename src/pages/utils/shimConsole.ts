import browser from 'webextension-polyfill';
export async function subscribeRuntimeConsole(observer: (event: ConsoleEvent) => void): Promise<() => void> {

	const callback = (message: unknown): void => {
		if (typeof message !== 'object' || message === null) {
			return;
		}

		if (!('name' in message) || !('event' in message)) {
			return;
		}

		if (!isConsoleEvent(message.event)) {
			return;
		}

		if (message.name === 'console-event') {
			observer(message.event);
		}
	}

	browser.runtime.onMessage.addListener(callback);
	return () => browser.runtime.onMessage.removeListener(callback);
}

export interface ConsoleEvent {
	eventType: 'log' | 'info' | 'warn' | 'error' | 'exception';
	message: string;
}

export function isConsoleEvent(event: unknown): event is ConsoleEvent {
	if (typeof event !== 'object' || event === null) {
		return false;
	}

	if (!('eventType' in event) || !('message' in event)) {
		return false;
	}

	return true;
}

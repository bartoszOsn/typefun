import browser from 'webextension-polyfill';
export async function subscribeRuntimeConsole(observer: (event: ConsoleEvent) => void): Promise<() => void> {

	const callback = (message: any) => {
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

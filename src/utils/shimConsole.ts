import { getExtensionApi } from './extensionApi';

export async function subscribeRuntimeConsole(observer: (event: ConsoleEvent) => void): Promise<() => void> {

	const callback = (message: any) => {
		if (message.name === 'console-event') {
			observer(message.event);
		}
	}

	getExtensionApi().runtime.onMessage.addListener(callback);
	return () => getExtensionApi().runtime.onMessage.removeListener(callback);
}

export interface ConsoleEvent {
	eventType: 'log' | 'info' | 'warn' | 'error' | 'exception';
	message: string;
}

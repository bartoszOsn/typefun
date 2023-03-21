export {};

(() => {
	const eventName = 'console-event';
	function dispatchConsoleEvent(eventType: string, args: Array<unknown>): void {
		const event = new CustomEvent(eventName, {
			detail: {
				eventType,
				message: args.join(', ')
			}
		});
		document.dispatchEvent(event);
	}

	(['log', 'info', 'warn', 'error'] as const).forEach((eventType) => {
		const oldConsole = console[eventType];
		console[eventType] = (...args) => {
			oldConsole(...args);
			dispatchConsoleEvent(eventType, args);
		}
	});
})();

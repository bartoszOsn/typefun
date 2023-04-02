import { onMounted } from 'vue';
import { useSnackbarManager } from '../components/snackbars/snackbar-hooks';
import { ConsoleEvent, subscribeRuntimeConsole } from '../utils/shimConsole';
import { SnackbarMessage, SnackbarMessageType } from '../components/snackbars/SnackbarManager';

export interface ConsoleHook {
	displayEvent(consoleEvent: ConsoleEvent): void;
}

export function useConsole(): ConsoleHook {
	const snackbarManager = useSnackbarManager();

	function consoleEventToSnackbarMessage(event: ConsoleEvent): SnackbarMessage {
		const typeMap: Record<ConsoleEvent['eventType'], SnackbarMessageType> = {
			log: SnackbarMessageType.info,
			info: SnackbarMessageType.info,
			warn: SnackbarMessageType.warning,
			error: SnackbarMessageType.error,
			exception: SnackbarMessageType.error
		}

		return new SnackbarMessage(typeMap[event.eventType], event.message);
	}

	onMounted(() => {
		return subscribeRuntimeConsole((event) => {
			console.log(event);
			snackbarManager.addMessage(consoleEventToSnackbarMessage(event));
		});
	});

	return {
		displayEvent(consoleEvent: ConsoleEvent): void {
			snackbarManager.addMessage(consoleEventToSnackbarMessage(consoleEvent));
		}
	}
}

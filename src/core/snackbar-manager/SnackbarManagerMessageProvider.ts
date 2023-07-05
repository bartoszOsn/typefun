import { Ref } from 'vue';
import { SnackbarManager, SnackbarMessage } from './SnackbarManager';

export interface SnackbarManagerMessageProvider extends SnackbarManager {
	getMessages(): Ref<Array<SnackbarMessage>>;
	removeMessage(message: SnackbarMessage): void
}

export function isSnackbarManagerMessageProvider(obj: SnackbarManager): obj is SnackbarManagerMessageProvider {
	return 'getMessages' in obj;
}

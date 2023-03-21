import { Ref } from 'vue';
import { SnackbarManager, SnackbarMessage } from './SnackbarManager';

export interface SnackbarManagerMessageProvider extends SnackbarManager {
	getMessages(): Ref<Array<SnackbarMessage>>;
}

export function isSnackbarManagerMessageProvider(obj: SnackbarManager): obj is SnackbarManagerMessageProvider {
	return 'getMessages' in obj;
}
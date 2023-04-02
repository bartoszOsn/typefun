import { inject, InjectionKey } from 'vue';
import { SnackbarManager } from './SnackbarManager';

export const snackbarManagerSymbol = Symbol('snackbarManager') as InjectionKey<SnackbarManager>;

export function useSnackbarManager(): SnackbarManager {
	  const snackbarManager = inject(snackbarManagerSymbol);

	if (!snackbarManager) {
		throw new Error('No snackbar manager provided');
	}

	return snackbarManager;
}

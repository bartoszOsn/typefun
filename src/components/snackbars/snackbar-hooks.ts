import { DefaultSnackbarManager, SnackbarManager } from './SnackbarManager';
import { inject, InjectionKey, provide } from 'vue';

const snackbarManagerSymbol = Symbol('snackbarManager') as InjectionKey<SnackbarManager>;

export function provideSnackbarManager(): DefaultSnackbarManager {
  const snackbarManager = new DefaultSnackbarManager();

  provide(snackbarManagerSymbol, snackbarManager);

  return snackbarManager;
}

export function useSnackbarManager(): SnackbarManager {
	  const snackbarManager = inject(snackbarManagerSymbol);

  if (!snackbarManager) {
	throw new Error('No snackbar manager provided');
  }

  return snackbarManager;
}
import { Plugin } from 'vue';
import { snackbarManagerSymbol } from './snackbar-hooks';
import { DefaultSnackbarManager } from './DefaultSnackbarManager';

export const snackbarManagerPlugin: Plugin = {
	install(app) {
		const snackbarManager = new DefaultSnackbarManager();
		app.provide(snackbarManagerSymbol, snackbarManager)
	}
}

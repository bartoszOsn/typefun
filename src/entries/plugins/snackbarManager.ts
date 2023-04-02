import { Plugin } from 'vue';
import { snackbarManagerSymbol } from '../components/snackbars/snackbar-hooks';
import { DefaultSnackbarManager } from '../components/snackbars/DefaultSnackbarManager';

export const snackbarManager: Plugin = {
	install(app) {
		const snackbarManager = new DefaultSnackbarManager();
		app.provide(snackbarManagerSymbol, snackbarManager)
	}
}

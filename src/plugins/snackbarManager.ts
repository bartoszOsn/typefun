import { Plugin, provide } from 'vue';
import { DefaultSnackbarManager } from '../components/snackbars/SnackbarManager';
import { snackbarManagerSymbol } from '../components/snackbars/snackbar-hooks';

export const snackbarManager: Plugin = {
	install(app) {
		const snackbarManager = new DefaultSnackbarManager();
		app.provide(snackbarManagerSymbol, snackbarManager)
	}
}
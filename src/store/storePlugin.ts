import { PiniaPluginContext } from 'pinia';
import browser from 'webextension-polyfill';

const storeActionMessageType = 'store-action';

export const storePlugin = (context: PiniaPluginContext) => {
	let invokingExternalAction = false;

	loadStoreFromStorage();

	listenToExternalPagesActions((name, args) => {
		invokeActionFromExternalPages(name, args);
	});

	context.store.$onAction((actionContext) => {
		if (!invokingExternalAction) {
			actionContext.after(() => {

				submitActionToExternalPages(actionContext.name, actionContext.args);
				saveStoreToStorage();
			});
		}
	});

	function invokeActionFromExternalPages(name: string, args: Array<unknown>) {
		invokingExternalAction = true;
		context.store[name](...args);
		invokingExternalAction = false;
	}

	function submitActionToExternalPages(name: string, args: Array<unknown>) {
		browser.runtime.sendMessage({
			type: storeActionMessageType,
			storeId: context.store.$id,
			name,
			args
		})
	}

	function listenToExternalPagesActions(callback: (name: string, args: Array<unknown>) => void) {
		browser.runtime.onMessage.addListener((message) => {
			if (message.type === storeActionMessageType && message.storeId === context.store.$id) {
				callback(message.name, message.args);
			}
		});
	}

	function saveStoreToStorage() {
		const state = normalizeState(context.store.$state);
		console.log('saving store to storage', state);
		browser.storage.local.set({
			[context.store.$id]: state
		});
	}

	function loadStoreFromStorage() {
		browser.storage.local.get(context.store.$id).then((store) => {
			console.log('store from storage', store[context.store.$id]);
			context.store.$patch(store[context.store.$id]);
		});
	}
}

function normalizeState(state: unknown): unknown {
	if (typeof state === 'object' && state !== null) {
		if (Object.keys(state).every(key => !isNaN(+key))) {
			return Object.entries(state)
				.sort(([key1], [key2]) => +key1 - +key2)
				.map(([key, value]) => normalizeState(value));
		}

		return Object.fromEntries(
			Object.entries(state).map(([key, value]) => [key, normalizeState(value)])
		);
	}

	return state;
}
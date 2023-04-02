import { PiniaPluginContext, StateTree } from 'pinia';
import browser from 'webextension-polyfill';

const storeActionMessageType = 'store-action';

declare module 'pinia' {
	export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A> {
		sync?: boolean;
	}
}

export const storePlugin = (context: PiniaPluginContext): void => {
	let invokingExternalAction = false;

	loadStoreFromStorage();

	if (context.options.sync) {
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
	}

	function invokeActionFromExternalPages(name: string, args: Array<unknown>): void {
		invokingExternalAction = true;
		context.store[name](...args);
		invokingExternalAction = false;
	}

	function submitActionToExternalPages(name: string, args: Array<unknown>): void {
		browser.runtime.sendMessage({
			type: storeActionMessageType,
			storeId: context.store.$id,
			name,
			args
		})
	}

	function listenToExternalPagesActions(callback: (name: string, args: Array<unknown>) => void): void {
		browser.runtime.onMessage.addListener((message) => {
			if (message.type === storeActionMessageType && message.storeId === context.store.$id) {
				callback(message.name, message.args);
			}
		});
	}

	function saveStoreToStorage(): void {
		const state = normalizeState(context.store.$state);
		browser.storage.local.set({
			[context.store.$id]: state
		});
	}

	function loadStoreFromStorage(): void {
		browser.storage.local.get(context.store.$id).then((store) => {
			context.store.$patch(store[context.store.$id]);
		});
	}
}

function normalizeState(state: unknown): unknown {
	if (typeof state === 'object' && state !== null) {
		if (Object.keys(state).every(key => !isNaN(+key))) {
			return Object.entries(state)
				.sort(([key1], [key2]) => +key1 - +key2)
				.map(([_key, value]) => normalizeState(value));
		}

		return Object.fromEntries(
			Object.entries(state).map(([key, value]) => [key, normalizeState(value)])
		);
	}

	return state;
}
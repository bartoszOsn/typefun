export interface ExtensionApi {
	devtools: {
		inspectedWindow: {
			eval: <TReturn = unknown>(expression: string, options?: { frameURL?: string; useContentScriptContext?: boolean }) => Promise<TReturn>;
		};
		panels: {
			create: (title: string, icon: string, page: string) => Promise<unknown>;
		};
	};
	tabs: {
		create(options: { url: string; active?: boolean; index?: number; openerTabId?: number; pinned?: boolean; windowId?: number; }): Promise<unknown>;
	};
	runtime: {
		onMessage: {
			addListener: (callback: (message: any) => void) => void;
			removeListener: (callback: (message: any) => void) => void;
		};
		sendMessage: (message: any, targetOrigin?: string) => void;
		getURL: (path: string) => string;
	};
}

declare const browser: ExtensionApi | undefined;
declare const chrome: ExtensionApi | undefined;

export function getExtensionApi(): ExtensionApi {
	if (typeof browser !== "undefined") {
		return browser;
	}
	else if (typeof chrome !== "undefined") {
		return chrome;
	}

	throw new Error('Could not find extension API.');
}
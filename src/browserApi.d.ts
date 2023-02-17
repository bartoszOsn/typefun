declare module browser {
	const devtools: {
		inspectedWindow: {
			eval: <TReturn = unknown>(expression: string, options?: { frameURL?: string; useContentScriptContext?: boolean }) => Promise<TReturn>;
		};
		panels: {
			create: (title: string, icon: string, page: string) => Promise<unknown>;
		};
	};
}

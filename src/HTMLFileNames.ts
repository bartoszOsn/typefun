export const HTMLFileNames = {
	devTools: 'devTools.html',
	devToolsPanel: 'devToolsPanel.html',
	manageScripts: 'manageScripts.html'
} satisfies Record<string, `${string}.html`>;

export type HTMLFileName = typeof HTMLFileNames[keyof typeof HTMLFileNames];

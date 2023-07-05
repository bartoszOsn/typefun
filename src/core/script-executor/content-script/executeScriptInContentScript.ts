export function executeScriptInContentScript(script: string): void {
	/**
	 * THIS IS A HACK!!!
	 * For now, it is the only solution to execute scripts in content script, while using Manifest V3.
	 *
	 * We need to wait for proper API support for this.
	 *
	 * For now, Google Chrome team announced that they won't accept any extensions to the store
	 * that use this hack.
	 */
	setTimeout(script, 0);
}
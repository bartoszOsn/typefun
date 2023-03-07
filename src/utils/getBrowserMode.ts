export enum BrowserMode {
	LIGHT = 'light',
	DARK = 'dark'
}

export function getBrowserMode(): BrowserMode {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	if (mediaQuery.matches) {
		return BrowserMode.DARK;
	}

	return BrowserMode.LIGHT;
}
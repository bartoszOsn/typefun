export {};

declare const browser: any;

browser.devtools.panels.create(
	"Editor",                      // title
	"/vite.svg",	               // icon
	"../devToolsPanel.entry.html"		   // content
).then((newPanel: any) => {
	// newPanel.onShown.addListener(initialisePanel);
	// newPanel.onHidden.addListener(unInitialisePanel);
});
export {};

browser.devtools.panels.create(
	"Editor",                      // title
	"/vite.svg",	               // icon
	"../devToolsPanel.html"		   // content
).then((newPanel: any) => {
	// newPanel.onShown.addListener(initialisePanel);
	// newPanel.onHidden.addListener(unInitialisePanel);
});
export interface Script {
	id: number;
	name: string;
	urlPattern: string;
	code: {
		raw: string;
		compiled: string;
		draft: string;
		modified: boolean;
	}
}

export interface ScriptsStoreState {
	nextScriptId: number;
	scripts: Array<Script>;
}
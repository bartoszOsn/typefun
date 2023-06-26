import { BaseState } from '@/core/global-store/state/BaseState';

export interface State2 extends BaseState<2> {
	nextScriptId: number;
	scripts: Array<Script>;
}

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

import { BaseState } from '@/utils/state-versioning/BaseState';

export interface State1 extends BaseState<1> {
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

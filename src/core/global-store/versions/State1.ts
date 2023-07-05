import { BaseState } from '@/utils/state-versioning/BaseState';

export interface State1 extends BaseState<1> {
	nextScript: number;
	scripts: Array<Script>;
}

console.log('dupa');
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

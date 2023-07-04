import { State0 } from './versions/State0';
import { State1 } from './versions/State1';
import { State2 } from './versions/State2';
import { getMigrate } from '@/utils/state-versioning/migrate';

export type StateVersions = [
	State0,
	State1,
	State2
];

export type ScriptsStoreState = State2;

export const migrate = getMigrate<StateVersions, ScriptsStoreState>({
	0: (state: State0): State1 => {
		return {
			...state,
			version: 1,
			scripts: []
		}
	},
	1: (state: State1): State2 => {
		return {
			...state,
			version: 2,
			nextScriptId: 1,
		}
	},
})

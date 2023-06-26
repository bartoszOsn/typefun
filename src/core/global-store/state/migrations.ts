import { NextState, StateVersions } from './StateVersions';
import { State1 } from './versions/State1';
import { State2 } from './versions/State2';

export const migrations: MigrationMap = {
	1: (state: State1): State2 => {
		return {
			...state,
			version: 2,
			nextScriptId: 1,
		}
	},
};

type MigrationMap = {
	[TState in AnyStateExceptLast as TState['version']]: (state: TState) => NextState<TState>
}

type AnyStateExceptLast = StateVersions extends [...infer TInit, infer TLast] ? TInit[number] : never;

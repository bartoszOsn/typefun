import { State1 } from './versions/State1';
import { State2 } from './versions/State2';
import { BaseState } from '@/core/global-store/state/BaseState';

export type StateVersions = [
	State1,
	State2
]

export type AnyState = StateVersions[number];

export type NextState<TState extends AnyState, TVersions extends Array<BaseState<number>> = StateVersions> =
	TVersions extends [infer TVersion, infer TNext, ...infer TRest extends Array<BaseState<number>>]
		? TVersion extends TState
			? TNext
			: NextState<TState, TRest>
		: never;

export type StateByVersion<TVersion extends AnyState['version']> = Extract<AnyState, BaseState<TVersion>>;
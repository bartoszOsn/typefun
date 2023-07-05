import { AnyState, BaseStateList } from './state';
import { BaseState } from '@/utils/state-versioning/BaseState';

export type MigrationMap<TStateList extends BaseStateList, CurrentState extends AnyState<TStateList>> = {
	[TState in Exclude<AnyState<TStateList>, CurrentState> as TState['version']]: (state: TState) => BaseState<number>
}

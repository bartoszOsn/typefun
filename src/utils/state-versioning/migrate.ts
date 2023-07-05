import { AnyState, BaseStateList } from './state';
import { MigrationMap } from '@/utils/state-versioning/migrations';

export interface Migrate<TStateList extends BaseStateList, CurrentState extends TStateList[number]> {
	(state: AnyState<TStateList>): CurrentState
}

export function getMigrate<TStateList extends BaseStateList, CurrentState extends TStateList[number]>(
	migrations: MigrationMap<TStateList, CurrentState>
): Migrate<TStateList, CurrentState> {
	return (state: AnyState<TStateList>): CurrentState => {
		while(state.version in migrations) {
			state = (migrations[state.version as keyof typeof migrations] as any)(state);
		}

		return state as CurrentState;
	}
}
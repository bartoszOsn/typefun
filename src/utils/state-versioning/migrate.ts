import { AnyState, BaseStateList } from './state';
import { MigrationMap } from '@/utils/state-versioning/migrations';

export interface Migrate<TStateList extends BaseStateList, CurrentState extends TStateList[number]> {
	(state: AnyState<TStateList>): CurrentState;
}

export function getMigrate<TStateList extends BaseStateList, CurrentState extends TStateList[number]>(
	migrations: MigrationMap<TStateList, CurrentState>
): Migrate<TStateList, CurrentState> {
	return (state: AnyState<TStateList>): CurrentState => {
		let migratedState = state;
		while(migratedState.version in migrations) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			migratedState = (migrations[migratedState.version as keyof typeof migrations] as any)(migratedState);
		}

		return migratedState as CurrentState;
	}
}

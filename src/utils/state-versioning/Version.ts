import { AnyState, BaseStateList } from '@/utils/state-versioning/state';

export type Version<TStateList extends BaseStateList> = AnyState<TStateList>['version'];
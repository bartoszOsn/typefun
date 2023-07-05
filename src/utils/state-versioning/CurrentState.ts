import { BaseStateList, StateByVersion } from '@/utils/state-versioning/state';
import { Version } from '@/utils/state-versioning/Version';
import { BaseState } from '@/utils/state-versioning/BaseState';

// export type CurrentState<TStateList extends BaseStateList> =
// 	TStateList extends [infer TFirst extends BaseState<number>, ...infer TRest extends BaseStateList]
// 		? TRest extends []
// 			? TFirst
// 			: CurrentState<TRest>
// 		: never;

export type CurrentState<TStateList extends BaseStateList> = [never, ...TStateList][TStateList['length']]

type A = CurrentState<[BaseState<1>, BaseState<2>, BaseState<3>]>
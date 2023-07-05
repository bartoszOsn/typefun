import { BaseStateList } from '@/utils/state-versioning/state';

// export type CurrentState<TStateList extends BaseStateList> =
// 	TStateList extends [infer TFirst extends BaseState<number>, ...infer TRest extends BaseStateList]
// 		? TRest extends []
// 			? TFirst
// 			: CurrentState<TRest>
// 		: never;

export type CurrentState<TStateList extends BaseStateList> = [never, ...TStateList][TStateList['length']]

import { BaseState } from './BaseState';
import { Version } from '@/utils/state-versioning/Version';

export type BaseStateList = Array<BaseState<number>>;

export type AnyState<StateList extends BaseStateList> = StateList[number];

export type StateByVersion<StateList extends BaseStateList, TVersion extends Version<StateList>> = Extract<AnyState<StateList>, BaseState<TVersion>>;
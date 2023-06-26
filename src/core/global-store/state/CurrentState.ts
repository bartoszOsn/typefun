import { StateByVersion } from '@/core/global-store/state/StateVersions';
import { CurrentVersion } from '@/core/global-store/state/currentVersion';

export type CurrentState = StateByVersion<CurrentVersion>;

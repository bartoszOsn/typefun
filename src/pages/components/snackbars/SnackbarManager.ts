import { UniqueId } from '@/utils//UniqueId';

export enum SnackbarMessageType {
	default = 'default',
	info = 'info',
	warning = 'warning',
	error = 'error'
}

export class SnackbarMessage {
	public readonly messageId = UniqueId.get();
	constructor(
		public readonly type: SnackbarMessageType,
		public readonly message: string
	) {
	}
}

export abstract class SnackbarManager {
	public abstract addMessage(message: SnackbarMessage): void;
	public abstract clearMessages(): void;
}

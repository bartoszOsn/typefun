import { UniqueId } from '../../utils/UniqueId';
import { computed, ref, Ref } from 'vue';

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

export class DefaultSnackbarManager extends SnackbarManager {
	static readonly SNACKBAR_TIMEOUT = 5000;
	private readonly messages = ref<Array<SnackbarState>>([]);

	public addMessage(message: SnackbarMessage): void {
		const timeoutId = setTimeout(() => {
			this.removeMessage(message);
		}, DefaultSnackbarManager.SNACKBAR_TIMEOUT);

		this.messages.value.push({ message, timeoutId });
	}

	public clearMessages(): void {
		for (let messageState of this.messages.value) {
			clearTimeout(messageState.timeoutId);
		}
		this.messages.value = [];
	}

	public getMessages(): Ref<Array<SnackbarMessage>> {
		return computed(() => this.messages.value.map(state => state.message));
	}

	public removeMessage(message: SnackbarMessage): void {
		const newMessages: Array<SnackbarState> = [];

		for (let messageState of this.messages.value) {
			if (messageState.message.messageId.equals(message.messageId)) {
				clearTimeout(messageState.timeoutId);
				continue;
			}

			newMessages.push(messageState);
		}

		this.messages.value = newMessages;
	}
}

interface SnackbarState {
	message: SnackbarMessage;
	timeoutId: ReturnType<typeof setTimeout>;
}
<script lang="ts" setup="">
import { useSnackbarManager } from './snackbar-hooks';
	import { SnackbarMessageType } from './SnackbarManager';

	const snackbarManager = useSnackbarManager();

	const messages = snackbarManager.getMessages();

	function getAlertType(type: SnackbarMessageType): 'info' | 'warning' | 'error' {
		switch (type) {
			case SnackbarMessageType.info:
				return 'info';
			case SnackbarMessageType.warning:
				return 'warning';
			case SnackbarMessageType.error:
				return 'error';
			default:
				return 'info'
		}
	}
</script>

<template>
	<slot />
	<div class="snackbar-container">
		<template v-for="message in messages" :key="message.messageId.internal()">
			<v-alert
				:text="message.message"
				closable
				:type="getAlertType(message.type)"

				@update:model-value="(value) => snackbarManager.removeMessage(message)"
			/>
		</template>
	</div>
</template>

<style scoped>
	.snackbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999999999999999;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
</style>
<script lang="ts" setup="">
import { onMounted, ref } from 'vue';
import { ConsoleEvent, subscribeRuntimeConsole } from '../utils/shimConsole';
import { useSnackbarManager } from './snackbars/snackbar-hooks';
import { SnackbarMessage, SnackbarMessageType } from './snackbars/SnackbarManager';
	// TODO: change into a hook.
	const snackbarManager = useSnackbarManager();

	function consoleEventToSnackbarMessage(event: ConsoleEvent): SnackbarMessage {
		const typeMap: Record<ConsoleEvent['eventType'], SnackbarMessageType> = {
			'log': SnackbarMessageType.info,
			'info': SnackbarMessageType.info,
			'warn': SnackbarMessageType.warning,
			'error': SnackbarMessageType.error,
			'exception': SnackbarMessageType.error
		}

		return new SnackbarMessage(typeMap[event.eventType], event.message);
	}

	onMounted(() => {
		return subscribeRuntimeConsole((event) => {
			console.log(event);
			snackbarManager.addMessage(consoleEventToSnackbarMessage(event));
		});
	});
</script>

<template>
</template>

<style scoped>

</style>
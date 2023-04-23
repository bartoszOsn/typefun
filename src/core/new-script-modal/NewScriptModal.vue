<script lang="ts" setup="">
import { ref, watch } from 'vue';

	const props = defineProps<{
		visible: boolean;
	}>();

	const emit = defineEmits<{
		(e: 'update:visible', visible: boolean): void;
		(e: 'create', name: string, pattern: string): void;
	}>();

	const name = ref('');
	const pattern = ref('');

	const create = () => {
		emit('create', name.value, pattern.value);
		emit('update:visible', false);
	}

	const hide = () => {
		emit('update:visible', false);
	}

	watch(() => props.visible, (visible) => {
		if (visible) {
			name.value = '';
			pattern.value = '';
		}
	});
</script>

<template>
	<v-dialog v-model="props.visible" @click:outside="() => emit('update:visible', false)">
		<v-card>
			<v-card-title>
				New Script
			</v-card-title>
			<v-card-text>
				<v-text-field v-model="name" label="Name" />
			</v-card-text>
			<v-card-text>
				<v-text-field v-model="pattern" label="Pattern" />
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn @click="hide">Cancel</v-btn>
				<v-btn @click="create">Create</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style scoped>

</style>
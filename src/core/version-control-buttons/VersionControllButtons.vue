<script lang="ts" setup="">
import { editor } from 'monaco-editor';
import IMarker = editor.IMarker;
import { ref } from 'vue';

const componentProps = defineProps<{
	disabled: boolean;
	errors: Array<IMarker>;
	showDiff: boolean;
}>();

const emits = defineEmits<{
	(e: 'revert'): void;
	(e: 'diff', showDiff: boolean): void;
	(e: 'save', addIgnores: boolean): void;
}>();

const saveInlineDialogShown = ref(false);

const onSave = (): void => {
	if (componentProps.errors.length > 0) {
		saveInlineDialogShown.value = true;
	} else {
		emits('save', false);
		saveInlineDialogShown.value = false;
	}
};

const addIgnoreAndSave = (): void => {
	emits('save', true);
	saveInlineDialogShown.value = false;
};
</script>

<template>
	<v-tooltip text="Revert" location="top">
		<template  v-slot:activator="{ props }">
			<div v-bind="props">
				<v-btn icon="mdi-arrow-u-left-top"
					   @click="emits('revert')"
					   :disabled="componentProps.disabled">
				</v-btn>
			</div>
		</template>
	</v-tooltip>

	<v-tooltip :text="componentProps.showDiff ? 'Show editor' : 'Show difference'" location="top">
		<template  v-slot:activator="{ props }">
			<div v-bind="props">
				<v-btn :icon=" componentProps.showDiff ? 'mdi-file-edit' : 'mdi-swap-horizontal-bold'"
					   @click="emits('diff', !componentProps.showDiff)"
					   :disabled="componentProps.disabled">
				</v-btn>
			</div>
		</template>
	</v-tooltip>

	<v-tooltip text="Save" location="top">
		<template  v-slot:activator="{ props }">
			<div v-bind="props">
				<v-btn icon="mdi-content-save"
					   @click="onSave"
					   :disabled="componentProps.disabled">
				</v-btn>
			</div>
		</template>
	</v-tooltip>

	<v-dialog v-model="saveInlineDialogShown">
		<v-card class="save-inline-dialog">
			<v-card-title class="headline">Save</v-card-title>
			<v-card-text>There are errors in the code. Do you want to save anyway?</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text @click="saveInlineDialogShown = false">Cancel</v-btn>
				<v-btn tonal @click="addIgnoreAndSave">Ignore errors and Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style scoped>
	.save-inline-dialog {
		pointer-events: all;
	}
</style>

<style>
	.save-inline-dialog-container {
		padding: 0 !important;
	}
</style>

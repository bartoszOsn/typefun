<script lang="ts" setup="">
const componentProps = defineProps<{
	disabled: boolean;
}>();

const emits = defineEmits<{
	(e: 'revert'): void;
	(e: 'diff'): void;
	(e: 'save'): void;
}>();
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

	<v-tooltip text="Difference – Not implemented yet." location="top">
		<template  v-slot:activator="{ props }">
			<div v-bind="props">
				<v-btn icon="mdi-swap-horizontal-bold"
					   @click="emits('diff')"
					   :disabled="componentProps.disabled">
				</v-btn>
			</div>
		</template>
	</v-tooltip>

	<v-tooltip text="Save" location="top">
		<template  v-slot:activator="{ props }">
			<div v-bind="props">
				<v-btn icon="mdi-content-save"
					   @click="emits('save')"
					   :disabled="componentProps.disabled">
				</v-btn>
			</div>
		</template>
	</v-tooltip>
</template>

<style scoped>

</style>
<script lang="ts" setup="">
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import { useManageScriptsStore } from '@/feature/manage-scripts-store/manageScriptsStore';
import { computed, ref } from 'vue';
import NewScriptModal from '@/core/new-script-modal/NewScriptModal.vue';

const props = defineProps<{
	currentScriptId: number;
}>();

const scriptsStore = useScriptsStore();
const manageScriptsStore = useManageScriptsStore();

const currentScript = computed(() => scriptsStore.getScriptById(props.currentScriptId));
const initialValues = computed(() => ({
	name: currentScript.value?.name,
	pattern: currentScript.value?.urlPattern,
}));

const editScriptModalVisible = ref(false);

const saveScript = (name: string, pattern: string): void => {
	scriptsStore.editScriptMeta(props.currentScriptId, name, pattern);
};

const openEditScriptModal = (id: number): void => {
	console.log('visible');
	editScriptModalVisible.value = true;
}
</script>

<template>
	<v-list-item @click="manageScriptsStore.setCurrentScript(currentScript.id)"
				 :active="manageScriptsStore.currentScriptId === currentScript.id"
				 :value="currentScript.id">
		<v-list-item-title>
			{{ currentScript.name }}
			<ModifiedDot v-if="currentScript.code.modified" />
		</v-list-item-title>
		<v-list-item-subtitle>{{ currentScript.urlPattern }}</v-list-item-subtitle>
		<template v-slot:append>
			<v-btn size="small" variant="text" icon="mdi-pencil" @click="openEditScriptModal(currentScript.id)" />
			<v-btn size="small" variant="text" icon="mdi-delete" @click="scriptsStore.removeScript(currentScript.id)" />
		</template>
		<NewScriptModal :visible="editScriptModalVisible"
						@update:visible="editScriptModalVisible = $event"
						@create="saveScript"
						:initial-values="initialValues"
						submit-label="Save"
		/>
	</v-list-item>
</template>

<style scoped>

</style>
<script lang="ts" setup="">

import Editor from '@/core/script-editor/ScriptEditor.vue';
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import NewScriptModal from '@/core/new-script-modal/NewScriptModal.vue';
import { ref } from 'vue';
import { useManageScriptsStore } from '@/feature/manage-scripts-store/manageScriptsStore';

const scriptsStore = useScriptsStore();
const manageScriptsStore = useManageScriptsStore();

const addScriptModalVisible = ref(false);

const addScript = (): void => {
	// scriptsStore.addScript('Hello world!', 'https://reddit.com/.*');
	addScriptModalVisible.value = true;
};

const createScript = (name: string, pattern: string): void => {
	scriptsStore.addScript(name, pattern);
};

const resetState = (): void => {
	scriptsStore.resetState();
};

const updateCode = (newCode: string): void => {
	manageScriptsStore.setCode(newCode);
};
</script>

<template>
	<v-app>
		<v-navigation-drawer :permanent="true">
			<v-list>
				<v-list-subheader>SCRIPTS</v-list-subheader>
				<v-list-item v-for="scriptName in scriptsStore.scripts"
							 :key="scriptName.id"
							 :value="scriptName.id"
							 :title="scriptName.name" />
			</v-list>

			<template v-slot:append>
				<v-divider />
				<v-btn prepend-icon="mdi-plus" class="ma-2" @click="addScript">Add script</v-btn>
				<v-btn prepend-icon="mdi-delete" class="ma-2" @click="resetState">Reset state</v-btn>
				<v-divider />
				<div class="pa-2">
					<v-form validate-on="submit" @submit.prevent="submit">
						<v-text-field
							model-value="Hello world!"
							label="Script name"
						></v-text-field>
						<v-text-field
							model-value="https://reddit.com/*."
							label="URL pattern"
						></v-text-field>
						<v-btn type="submit" block class="mt-2">Save</v-btn>
					</v-form>
				</div>
			</template>
		</v-navigation-drawer>
		<v-main class="main-container">
			<editor v-if="manageScriptsStore.currentScriptId" :code="manageScriptsStore.currentScript.code.draft" @update:code="updateCode" />
		</v-main>
	</v-app>
	<NewScriptModal :visible="addScriptModalVisible" @update:visible="addScriptModalVisible = $event" @create="createScript" />
</template>

<style scoped>
.main-container {
	display: flex;
	align-items: stretch;
	justify-content: stretch;
}
</style>
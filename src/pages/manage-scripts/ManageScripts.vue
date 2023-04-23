<script lang="ts" setup="">

import Editor from '@/core/script-editor/ScriptEditor.vue';
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import NewScriptModal from '@/core/new-script-modal/NewScriptModal.vue';
import { ref } from 'vue';
import { useManageScriptsStore } from '@/feature/manage-scripts-store/manageScriptsStore';
import ModifiedDot from '@/utils/modifiedDot.vue';
import VersionControllButtons from '@/core/version-control-buttons/VersionControllButtons.vue';

const scriptsStore = useScriptsStore();
const manageScriptsStore = useManageScriptsStore();

const addScriptModalVisible = ref(false);

const addScript = (): void => {
	// scriptsStore.addScript('Hello world!', 'https://reddit.com/.*');
	addScriptModalVisible.value = true;
};

const resetState = (): void => {
	scriptsStore.resetState();
};

const updateCode = (newCode: string): void => {
	manageScriptsStore.setCode(newCode);
};

const createScript = (name: string, pattern: string): void => {
	scriptsStore.addScript(name, pattern);
};

const revertScript = (): void => {
	manageScriptsStore.revertCurrentScript();
}

const saveScript = (): void => {
	manageScriptsStore.saveCurrentScript();
}
</script>

<template>
	<v-app>
		<v-app-bar app>
			<v-toolbar-title>
				{{ manageScriptsStore.currentScript?.name }}
				<ModifiedDot v-if="manageScriptsStore.currentScript?.code.modified" />
			</v-toolbar-title>
			<template v-slot:append>
				<VersionControllButtons :disabled="!manageScriptsStore.currentScript?.code.modified"
									 	@save="saveScript"
									 	@revert="revertScript"
										@diff="() => {}"
				/>
			</template>
		</v-app-bar>
		<v-navigation-drawer :permanent="true">
			<v-list>
				<v-list-subheader>SCRIPTS</v-list-subheader>
				<v-list-item v-for="scriptName in scriptsStore.scripts"
							 @click="manageScriptsStore.setCurrentScript(scriptName.id)"
							 :active="manageScriptsStore.currentScriptId === scriptName.id"
							 :key="scriptName.id"
							 :value="scriptName.id">
					<v-list-item-title>
						{{ scriptName.name }}
						<ModifiedDot v-if="scriptName.code.modified" />
					</v-list-item-title>
				</v-list-item>
			</v-list>

			<template v-slot:append>
				<v-divider />
				<v-btn prepend-icon="mdi-plus" class="ma-2" @click="addScript">Add script</v-btn>
				<v-btn prepend-icon="mdi-delete" class="ma-2" @click="resetState">Reset state</v-btn>
				<v-divider />
<!--				<div class="pa-2">-->
<!--					<v-form validate-on="submit" @submit.prevent="submit">-->
<!--						<v-text-field-->
<!--							model-value="Hello world!"-->
<!--							label="Script name"-->
<!--						></v-text-field>-->
<!--						<v-text-field-->
<!--							model-value="https://reddit.com/*."-->
<!--							label="URL pattern"-->
<!--						></v-text-field>-->
<!--						<v-btn type="submit" block class="mt-2">Save</v-btn>-->
<!--					</v-form>-->
<!--				</div>-->
			</template>
		</v-navigation-drawer>
		<v-main class="main-container">
			<editor v-if="manageScriptsStore.currentScript" :code="manageScriptsStore.currentScript.code.draft" @update:code="updateCode" />
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

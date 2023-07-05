<script lang="ts" setup="">
import { ref } from 'vue';
import { editor } from 'monaco-editor';
import ScriptListItem from './ScriptListItem.vue';
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import NewScriptModal from '@/core/new-script-modal/NewScriptModal.vue';
import { useManageScriptsStore } from '@/feature/manage-scripts-store/manageScriptsStore';
import ModifiedDot from '@/utils/modifiedDot.vue';
import VersionControllButtons from '@/core/version-control-buttons/VersionControllButtons.vue';
import ScriptDiffEditor from '@/core/script-editor/ScriptDiffEditor.vue';
import IMarker = editor.IMarker;

const scriptsStore = useScriptsStore();
const manageScriptsStore = useManageScriptsStore();

const addScriptModalVisible = ref(false);
const editorErrors = ref<Array<IMarker>>([]);
const isDiffView = ref(false);

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

const saveScript = (addIgnores: boolean): void => {
	if (addIgnores) {
		manageScriptsStore.addIgnoresToCurrentScript(
			editorErrors.value.map(e => e.startLineNumber)
		);
	}

	manageScriptsStore.saveCurrentScript();
}

const showDiff = (diff: boolean): void => {
	isDiffView.value = diff;
};
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
										:errors="editorErrors"
										:showDiff="isDiffView"
									 	@save="saveScript"
									 	@revert="revertScript"
										@diff="showDiff"
				/>
			</template>
		</v-app-bar>
		<v-navigation-drawer :permanent="true">
			<v-list>
				<v-list-subheader>SCRIPTS</v-list-subheader>
				<v-list-item prepend-icon="mdi-plus" @click="addScript">
					<v-list-item-title>Add script</v-list-item-title>
				</v-list-item>
				<v-divider inset></v-divider>
				<ScriptListItem v-for="script in scriptsStore.scripts" :key="script.id" :currentScriptId="script.id" />
			</v-list>

			<template v-slot:append>
				<v-divider />
				<v-btn prepend-icon="mdi-plus" class="ma-2" @click="addScript">Add script</v-btn>
				<v-btn prepend-icon="mdi-delete" class="ma-2" @click="resetState">Reset state</v-btn>
				<v-divider />
			</template>
		</v-navigation-drawer>
		<v-main class="main-container">
			<template v-if="manageScriptsStore.currentScript">
				<editor v-if="!isDiffView"
						:code="manageScriptsStore.currentScript.code.draft"
						@update:code="updateCode"
						@update:errors="(errors) => editorErrors = errors" />
				<ScriptDiffEditor v-else
								  :current="manageScriptsStore.currentScript?.code.draft ?? ''"
								  :previous="manageScriptsStore.currentScript?.code.raw ?? ''" />
			</template>
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

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import browser from 'webextension-polyfill';
import { editor } from 'monaco-editor';
import IMarker = editor.IMarker;
import Editor from '@/core/script-editor/ScriptEditor.vue';
import SnackbarContainer from '@/core/snackbar-manager/SnackbarContainer.vue';
import { useDevToolsPanelStore } from '@/feature/devtools-panel-store/devToolsPanelStore';
import { useListenToUrl } from '@/feature/devtools-panel-store/useListenToUrl';
import { compileTs } from '@/core/ts-compilator/compileTs';
import { openManageScript } from '@/core/navigation/openManageScript';
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import NoApplicableScriptSplashScreen from '@/feature/devtools-splash/NoApplicableScriptSplashScreen.vue';
import VersionControllButtons from '@/core/version-control-buttons/VersionControllButtons.vue';
import { executeScript } from '@/core/script-executor/executeScript';
import ScriptDiffEditor from '@/core/script-editor/ScriptDiffEditor.vue';
import ProductWordmark from '@/core/theme/ProductWordmark.vue';

const scriptsStore = useScriptsStore();
const devToolsPanelStore = useDevToolsPanelStore();
useListenToUrl();

const editorErrors = ref<Array<IMarker>>([]);
const isDiffView = ref(false);

const stopWatchingForFirstApplicableScript = watchEffect(() => {
	if (devToolsPanelStore.applicableScripts.length > 0) {
		devToolsPanelStore.setFirstApplicableScriptAsCurrent();
		stopWatchingForFirstApplicableScript();
	}
}, { });

const run: () => void = () => {
	if (!devToolsPanelStore.currentScript) {
		throw new Error('No current script');
	}

	const transpiled = compileTs(devToolsPanelStore.currentScript?.code.draft);

	executeScript(transpiled, browser.devtools.inspectedWindow.tabId);

	// browser.devtools.inspectedWindow.eval(transpiled).then()
	// 	})
};

const createScript = (name: string, pattern: string): void => {
	// TODO: warn if pattern doesn't match current url
	scriptsStore.addScript(name, pattern);
};

const revertScript = (): void => {
	devToolsPanelStore.revertCurrentScript();
}

const saveScript = (addIgnores: boolean): void => {
	if (addIgnores) {
		devToolsPanelStore.addIgnoresToCurrentScript(
			editorErrors.value.map(e => e.startLineNumber)
		);
	}
	devToolsPanelStore.saveCurrentScript();
}

const selectScript = (scriptId: number): void => {
	devToolsPanelStore.setCurrentScriptId(scriptId);
}

const showDiff = (diff: boolean): void => {
	isDiffView.value = diff;
};
</script>

<template>
	<SnackbarContainer>
		<v-app>
			<template v-if="devToolsPanelStore.showNoApplicableScriptSplashScreen">
				<NoApplicableScriptSplashScreen @create="createScript" />
			</template>
			<template v-else>
				<v-app-bar>
					<v-app-bar-title>
						<ProductWordmark :hide-wordmark-width="750" />
					</v-app-bar-title>
					<v-select :items="devToolsPanelStore.applicableScripts"
							  label="Script"
							  density="compact"
							  class="script-select"
							  item-title="name"
							  item-value="id"
							  :model-value="devToolsPanelStore.currentScriptId"
							  @update:modelValue="selectScript">
					</v-select>
					<template v-slot:append>
						<VersionControllButtons :disabled="!devToolsPanelStore.currentScript?.code.modified"
												:errors="editorErrors"
												:show-diff="isDiffView"
												@revert="revertScript"
												@diff="showDiff"
												@save="saveScript" />

						<v-divider vertical class="mx-4"></v-divider>

						<v-tooltip text="Manage scripts" location="top">
							<template  v-slot:activator="{ props }">
								<v-btn icon="mdi-exit-to-app" @click="openManageScript" v-bind="props"></v-btn>
							</template>
						</v-tooltip>

						<v-tooltip text="Run script" location="top">
							<template  v-slot:activator="{ props }">
								<v-btn icon="mdi-play" @click="run" v-bind="props"></v-btn>
							</template>
						</v-tooltip>
					</template>
				</v-app-bar>
				<v-main class="main-container">
					<Editor v-if="!isDiffView"
							:code="devToolsPanelStore.currentScript?.code.draft ?? ''"
							@update:code="(code) => devToolsPanelStore.setCurrentScriptCode(code)"
							@update:errors="(errors) => editorErrors = errors" />
					<ScriptDiffEditor v-else
									  :current="devToolsPanelStore.currentScript?.code.draft ?? ''"
									  :previous="devToolsPanelStore.currentScript?.code.raw ?? ''" />
				</v-main>
			</template>
		</v-app>
	</SnackbarContainer>
</template>

<style scoped>
	.main-container {
		display: flex;
		align-items: stretch;
		justify-content: stretch;
	}

	.script-select {
		margin-top: 24px;
		max-width: 300px;
	}
</style>

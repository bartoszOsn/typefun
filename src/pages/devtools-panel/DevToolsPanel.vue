<script setup lang="ts">
import browser from 'webextension-polyfill';
import 'typescript/lib/typescriptServices';
import Editor from '@/core/script-editor/ScriptEditor.vue';
import SnackbarContainer from '@/core/snackbar-manager/SnackbarContainer.vue';
import { useConsole } from '@/feature//devtools-console/useConsole';
import { useDevToolsPanelStore } from '@/feature/devtools-panel-store/devToolsPanelStore';
import { useListenToUrl } from '@/feature/devtools-panel-store/useListenToUrl';
import { compileTs } from '@/core/ts-compilator/compileTs';
import { openManageScript } from '@/core/navigation/openManageScript';
import { useScriptsStore } from '@/core/global-store/scriptsStore';
import NoApplicableScriptSplashScreen from '@/feature/devtools-splash/NoApplicableScriptSplashScreen.vue';
import { watchEffect } from 'vue';

const scriptsStore = useScriptsStore();
const devToolsPanelStore = useDevToolsPanelStore();
devToolsPanelStore.setFirstApplicableScriptAsCurrent();
const { displayEvent } = useConsole();
useListenToUrl();

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

	browser.devtools.inspectedWindow.eval(transpiled)
		.then(([result, exception]) => {
			if (!result && exception && exception.isException) {
				displayEvent({ eventType: 'exception', message: exception.value });
			}
		})
};

const createScript = (name: string, pattern: string): void => {
	// TODO: warn if pattern doesn't match current url
	scriptsStore.addScript(name, pattern);
};

const revertScript = (): void => {
	devToolsPanelStore.revertCurrentScript();
}

const saveScript = (): void => {
	devToolsPanelStore.saveCurrentScript();
}

const showDiff = (): void => {};
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
						<template v-slot:text>
							<span>{{ devToolsPanelStore.currentScript.name }}</span>
							<span v-if="devToolsPanelStore.currentScript.code.modified" class="font-weight-black text-amber"> *</span>
						</template>

						<v-menu>
							<template v-slot:activator="{ props }">
								<v-btn icon="mdi-chevron-down" v-bind="props"></v-btn>
							</template>
							<v-list :items="devToolsPanelStore.applicableScripts"
									item-title="name"
									item-value="id"
									:selected="[devToolsPanelStore.currentScriptId]"
									mandatory
									@update:selected="(id) => devToolsPanelStore.setCurrentScriptId(id[0])">
							</v-list>
						</v-menu>
					</v-app-bar-title>
					<template v-slot:append>
						<v-tooltip text="Revert" location="top">
							<template  v-slot:activator="{ props }">
								<div v-bind="props">
									<v-btn icon="mdi-arrow-u-left-top"
										   @click="revertScript"
										   :disabled="!devToolsPanelStore.currentScript.code.modified">
									</v-btn>
								</div>
							</template>
						</v-tooltip>

						<v-tooltip text="Difference – Not implemented yet." location="top">
							<template  v-slot:activator="{ props }">
								<div v-bind="props">
									<v-btn icon="mdi-swap-horizontal-bold"
										   @click="showDiff"
										   :disabled="!devToolsPanelStore.currentScript.code.modified">
									</v-btn>
								</div>
							</template>
						</v-tooltip>

						<v-tooltip text="Save" location="top">
							<template  v-slot:activator="{ props }">
								<div v-bind="props">
									<v-btn icon="mdi-content-save"
										   @click="saveScript"
										   :disabled="!devToolsPanelStore.currentScript.code.modified">
									</v-btn>
								</div>
							</template>
						</v-tooltip>

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
					<editor :code="devToolsPanelStore.currentScript.code.draft"
							@update:code="(code) => devToolsPanelStore.setCurrentScriptCode(code)" />
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
</style>

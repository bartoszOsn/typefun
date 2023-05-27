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
import ModifiedDot from '@/utils/modifiedDot.vue';
import VersionControllButtons from '@/core/version-control-buttons/VersionControllButtons.vue';

const scriptsStore = useScriptsStore();
const devToolsPanelStore = useDevToolsPanelStore();
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

const selectScript = (scriptId: Array<unknown>): void => {
	const firstId = scriptId[0];

	if (typeof firstId != 'number') {
		throw new Error('Script id is not a number');
	}

	devToolsPanelStore.setCurrentScriptId(firstId);
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
							<span>{{ devToolsPanelStore.currentScript?.name }}</span>
							<ModifiedDot v-if="devToolsPanelStore.currentScript?.code.modified" />
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
									@update:selected="selectScript">
							</v-list>
						</v-menu>
					</v-app-bar-title>
					<template v-slot:append>
						<VersionControllButtons :disabled="!devToolsPanelStore.currentScript?.code.modified"
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
					<editor :code="devToolsPanelStore.currentScript?.code.draft ?? ''"
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

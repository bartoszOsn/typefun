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

const scriptsStore = useScriptsStore();
const devToolsPanelStore = useDevToolsPanelStore();
devToolsPanelStore.setFirstApplicableScriptAsCurrent();
const { displayEvent } = useConsole();
useListenToUrl();

// eslint-disable-next-line prefer-const
let code = 'console.log("Hello World!")';

const log: () => void = () => {
	const transpiled = compileTs(code);

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
						<template v-slot:text>Hello world!</template>

						<v-menu>
							<template v-slot:activator="{ props }">
								<v-btn icon="mdi-chevron-down" v-bind="props"></v-btn>
							</template>
							<v-list>
								<v-list-item v-for="scriptName in devToolsPanelStore.applicableScripts" :key="scriptName.id" :value="scriptName.id">
									<v-list-item-title>{{scriptName.name}}</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-app-bar-title>
					<template v-slot:append>
						<v-tooltip text="Revert" location="top">
							<template  v-slot:activator="{ props }">
								<v-btn icon="mdi-arrow-u-left-top" @click="openManageScript" v-bind="props"></v-btn>
							</template>
						</v-tooltip>

						<v-tooltip text="Difference – Not implemented yet." location="top">
							<template  v-slot:activator="{ props }">
								<v-btn icon="mdi-swap-horizontal-bold" disabled v-bind="props"></v-btn>
							</template>
						</v-tooltip>

						<v-tooltip text="Save" location="top">
							<template  v-slot:activator="{ props }">
								<v-btn icon="mdi-content-save" @click="openManageScript" v-bind="props"></v-btn>
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
								<v-btn icon="mdi-play" @click="log" v-bind="props"></v-btn>
							</template>
						</v-tooltip>
					</template>
				</v-app-bar>
				<v-main class="main-container">
					<editor v-model:code="code" />
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

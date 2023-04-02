<script setup lang="ts">
import browser from 'webextension-polyfill';
import { ts } from 'ts-services';
import 'typescript/lib/typescriptServices';
import Editor from '../components/ScriptEditor.vue';
import SnackbarContainer from '../components/snackbars/SnackbarContainer.vue';
import { useConsole } from '../hooks/useConsole';
import { useDevToolsPanelStore } from '../store/devToolsPanelStore';
import { useListenToUrl } from '../hooks/useListenToUrl';
import manageScriptsUrl from '../html/manageScripts.html?href';

const { displayEvent } = useConsole();
useListenToUrl();
const devToolsPanelStore = useDevToolsPanelStore();

const code = 'console.log("Hello World!")';

const log: () => void = () => {
	const transpiled = ts.transpile(
		code,
		{
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext
		},
		'test.ts',
		[]
	);

	browser.devtools.inspectedWindow.eval(transpiled)
		.then(([result, exception]) => {
			if (!result && exception && exception.isException) {
				displayEvent({ eventType: 'exception', message: exception.value });
			}
		})
};

const openManageScript: () => void = () => {
	browser.tabs.create({
		url: manageScriptsUrl
	});
};
</script>

<template>
	<SnackbarContainer>
		<v-app>
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

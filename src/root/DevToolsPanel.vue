<script setup lang="ts">

import { ts } from 'ts-services';
import 'typescript/lib/typescriptServices';
import { getExtensionApi } from '../utils/extensionApi';
import { HTMLFileNames } from '../HTMLFileNames';
import Editor from '../components/editor.vue';
import Console from '../components/console.vue';
import SnackbarContainer from '../components/snackbars/SnackbarContainer.vue';

let code = 'console.log("Hello World!")';

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

	getExtensionApi().devtools.inspectedWindow.eval(transpiled);
};

const openManageScript: () => void = () => {
	getExtensionApi().tabs.create({
		url: HTMLFileNames.manageScripts
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
							<v-list-item>
								<v-list-item-title>Hello world!</v-list-item-title>
							</v-list-item>
							<v-list-item>
								<v-list-item-title>remove 3rd column</v-list-item-title>
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
		<console />
	</SnackbarContainer>
</template>

<style scoped>
	.main-container {
		display: flex;
		align-items: stretch;
		justify-content: stretch;
	}
</style>

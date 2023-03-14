<script setup lang="ts">

import { ts } from 'ts-services';
import 'typescript/lib/typescriptServices';
import { getExtensionApi } from '../utils/extensionApi';
import { HTMLFileNames } from '../HTMLFileNames';
import Editor from '../components/editor.vue';

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
	<v-app>
		<v-app-bar location="bottom">
			<v-select density="compact" :items="['Hello World', 'remove 3rd column']"></v-select>
			<v-btn class="manage-button" @click="openManageScript">Manage script</v-btn>
			<v-btn class="run-button" @click="log">Run</v-btn>
		</v-app-bar>
		<v-main class="main-container">
			<editor v-model:code="code" />
		</v-main>
	</v-app>
</template>

<style scoped>
	/*.dev-tools {*/
	/*	width: 100%;*/
	/*	height: calc(100vh - 18px);;*/

	/*	display: flex;*/
	/*	flex-direction: column;*/
	/*	gap: 4px;*/
	/*}*/

	/*.toolbar {*/
	/*	display: flex;*/
	/*	gap: 4px;*/
	/*	margin: 0 4px 4px 4px;*/
	/*}*/

	.main-container {
		display: flex;
		align-items: stretch;
		justify-content: stretch;
	}

	.run-button {
		flex-grow: 1;
	}

	.manage-button {
		flex-grow: 0;
	}
</style>

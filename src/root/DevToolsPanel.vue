<script setup lang="ts">

import { ts } from 'ts-services';
import 'typescript/lib/typescriptServices';
import { getExtensionApi } from '../utils/extensionApi';
import { HTMLFileNames } from '../HTMLFileNames';
import Editor from '../components/editor.vue';

let code = 'console.log("message")';

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
	<div class="dev-tools">
		<editor v-model:code="code" />
		<div class="toolbar">
			<v-select density="compact" :items="['Hello World', 'remove 3rd column']"></v-select>
			<v-btn class="manage-button" @click="openManageScript">Manage script</v-btn>
			<v-btn class="run-button" @click="log">Run</v-btn>
		</div>
	</div>
</template>

<style scoped>
	.dev-tools {
		width: 100%;
		height: calc(100vh - 18px);;

		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.toolbar {
		display: flex;
		gap: 4px;
		margin: 0 4px 4px 4px;
	}

	.run-button {
		flex-grow: 1;
	}

	.manage-button {
		flex-grow: 0;
	}
</style>

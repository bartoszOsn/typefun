<script setup lang="ts">

import * as monaco from 'monaco-editor';
import { ts } from 'ts-services';
import 'typescript/lib/typescriptServices';
import { onMounted, ref } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { getBrowserMode } from '../utils/getBrowserMode';
import { getExtensionApi } from '../utils/extensionApi';
import { HTMLFileNames } from '../HTMLFileNames';

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'typescript' || label === 'javascript') {
			return new TsWorker()
		}
		return new EditorWorker()
	}
}
const editorRef = ref<HTMLDivElement | null>(null);
let editor: ReturnType<typeof monaco.editor.create> | null = null;

onMounted(() => {
	monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: false,
	});

	monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ESNext,
		allowNonTsExtensions: true,
		lib: ['esnext', 'dom'],
	});

	editor = monaco.editor.create(editorRef.value!, {
		value: 'console.log("Hello world")',
		language: 'javascript',
		theme: `vs-${getBrowserMode()}`
	});
});

const log: () => void = () => {
	if (!editor) return;

	const code = editor.getValue();
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
		<div class="editor" ref="editorRef"></div>
		<div class="toolbar">
			<select>
				<option>Hello World</option>
				<option>remove 3rd column</option>
			</select>
			<button class="manage-button" @click="openManageScript">Manage script</button>
			<button class="run-button" @click="log">Run</button>
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

	.editor {
		width: 100%;
		height: 100%;
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

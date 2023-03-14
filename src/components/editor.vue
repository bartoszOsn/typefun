<script setup lang="ts">

import * as monaco from 'monaco-editor';
import 'typescript/lib/typescriptServices';
import { onMounted, ref } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { getBrowserMode } from '../utils/getBrowserMode';

const props = defineProps<{
	code: string;
}>();

const emit = defineEmits<{
	(e: 'update:code', code: string): void;
}>();

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'typescript' || label === 'javascript') {
			return new TsWorker()
		}
		return new EditorWorker()
	}
}
const editorRef = ref<HTMLDivElement | null>(null);

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

	const editorDomElement = editorRef.value;

	if (!editorDomElement) {
		throw new Error('editorDomElement is null');
	}

	const editor = monaco.editor.create(editorDomElement, {
		value: props.code,
		language: 'javascript',
		theme: `vs-${getBrowserMode()}`
	});

	const disposeOnModelChange = editor.getModel()?.onDidChangeContent(() => {
		emit('update:code', editor.getModel()?.getValue() ?? '');
	});

	return () => {
		disposeOnModelChange?.dispose();
		editor.dispose();
	}
});
</script>

<template>
	<div class="editor" ref="editorRef"></div>
</template>

<style scoped>
.editor {
	width: 100%;
	height: 100%;
}
</style>

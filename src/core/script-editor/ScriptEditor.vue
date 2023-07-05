<script setup lang="ts">

import * as monaco from 'monaco-editor';
import { editor, MarkerSeverity } from 'monaco-editor';
import { onMounted, ref, watch } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker&inline';
import IMarker = editor.IMarker;
import { getBrowserMode } from '@/utils/getBrowserMode';

const props = defineProps<{
	code: string;
}>();

const emit = defineEmits<{
	(e: 'update:code', code: string): void;
	(e: 'update:errors', errors: Array<IMarker>): void;
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
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
	monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: false,
		noSyntaxValidation: false
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

	editor = monaco.editor.create(editorDomElement, {
		value: props.code,
		language: 'typescript',
		theme: `vs-${getBrowserMode()}`,
		automaticLayout: true,
		scrollBeyondLastLine: false,
		padding: {
			top: 4,
			bottom: 0
		},
	});

	monaco.editor.onDidChangeMarkers(() => {
		const markers = monaco.editor
			.getModelMarkers({ resource: editor?.getModel()?.uri })
			.filter(marker => marker.severity === MarkerSeverity.Error);

		emit('update:errors', markers);
	});

	const disposeOnModelChange = editor.getModel()?.onDidChangeContent(() => {
		emit('update:code', editor?.getModel()?.getValue() ?? '');
	});


	editor.layout({ width: 0, height: 0 })

	return () => {
		disposeOnModelChange?.dispose();
		editor?.dispose();
	}
});

watch(() => props.code, () => {
	if (editor && props.code !== editor.getValue()) {
		editor.setValue(props.code);
		console.log('editor.setValue(props.code);', props.code)
	}
});
</script>

<template>
	<div class="editor" ref="editorRef"></div>
</template>

<style scoped>
.editor {
	flex-grow: 1;
}
</style>

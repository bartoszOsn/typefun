<script setup lang="ts">

import * as monaco from 'monaco-editor';
import { onMounted, ref, watch } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker&inline';
import { getBrowserMode } from '@/utils/getBrowserMode';

const props = defineProps<{
	current: string;
	previous: string;
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

const model: monaco.editor.IDiffEditorModel = {
	original: monaco.editor.createModel(props.previous, 'typescript'),
	modified: monaco.editor.createModel(props.current, 'typescript'),
};

let editor: monaco.editor.IStandaloneDiffEditor | null = null;

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

	editor = monaco.editor.createDiffEditor(editorDomElement, {
		renderIndicators: true,
		originalEditable: false,
		theme: `vs-${getBrowserMode()}`,
		automaticLayout: true,
		scrollBeyondLastLine: false,
		padding: {
			top: 4,
			bottom: 0
		},
	});

	editor.setModel(model);

	editor.layout({ width: 0, height: 0 })

	return () => {
		editor?.dispose();
	}
});

watch(() => props.previous, () => {
	if (props.previous !== model.original.getValue()) {
		model.original.setValue(props.previous);
	}
});
watch(() => props.current, () => {
	if (props.previous !== model.modified.getValue()) {
		model.modified.setValue(props.current);
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

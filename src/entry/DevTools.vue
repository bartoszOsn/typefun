<script setup lang="ts">

	import * as monaco from 'monaco-editor';
	import 'typescript/lib/typescriptServices';
	import { onMounted, ref } from 'vue';

	import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
	import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'

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

		});
	});

	const log = () => {
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

		console.log({ code, transpiled })
	};
</script>

<template>
	<div class="dev-tools">
		<div class="editor" ref="editorRef"></div>
		<button @click="log">Run</button>
	</div>
</template>

<style scoped>
	.dev-tools {
		width: 100%;
		height: calc(100vh - 18px);;

		display: flex;
		flex-direction: column;
	}

	.editor {
		width: 100%;
		height: 100%;
	}
</style>

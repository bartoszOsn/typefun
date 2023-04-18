import { ts } from 'ts-services';

export function compileTs(code: string): string {
	return ts.transpile(
		code,
		{
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext
		},
		'test.ts',
		[]
	);
}
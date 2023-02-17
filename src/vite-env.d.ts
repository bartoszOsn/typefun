/// <reference types="vite/client" />
/// <reference types="./browserApi" />

declare module 'ts-services' {
	export const ts: typeof import('typescript');
}
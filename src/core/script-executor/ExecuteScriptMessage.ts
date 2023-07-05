export interface ExecuteScriptMessage {
	type: 'execute-script';
	script: string;
}

export function isExecuteScriptMessage(message: unknown): message is ExecuteScriptMessage {
	return typeof message === 'object'
		&& message !== null
		&& 'type' in message
		&& message.type === 'execute-script'
		&& 'script' in message
		&& typeof message.script === 'string';
}

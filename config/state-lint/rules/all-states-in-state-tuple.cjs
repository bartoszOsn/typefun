const path = require('path');
module.exports = {
	meta: {
		type: "problem",
		schema: {
			type: 'Object',
			additionalProperties: false,
			properties: {
				"stateTuple": {
					type: 'string'
				},
				"stateDirectory": {
					type: 'string'
				},
				"stateFiles": {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			}
		}
	},
	create: function(context) {
		const stateTuple = context.options[0].stateTuple;
		const stateFiles = new Set(context.options[0].stateFiles);
		const stateDirectory = context.options[0].stateDirectory;

		const typeNameToFileName = new Map();

		return {
			['ImportDeclaration']: function(node) {
				const relativePath = node.source.value;
				const specifiers = node.specifiers.map(specifier => specifier.local.name);

				const absolutePath = path.resolve(path.dirname(context.getFilename()), relativePath);

				for (let specifier of specifiers) {
					typeNameToFileName.set(specifier, absolutePath);
				}
			},

			[`TSTypeAliasDeclaration[id.name=${stateTuple}] > TSTupleType > TSTypeReference`]: function(node) {
				const originFile = typeNameToFileName.get(node.typeName.name);
				if (!originFile || !originFile.startsWith(stateDirectory)) {
					context.report({ message: `State tuple ${stateTuple} contains a type ${node.typeName.name} that is not in the state directory ${stateDirectory}.`, node });
				}

				stateFiles.delete(originFile + '.ts');
			},

			['Program:exit']: function(node) {
				for (let stateFile of stateFiles) {
					context.report({ message: `State file ${stateFile} is not included in the state tuple ${stateTuple}.`, node: node });
				}
			}
		};
	}
};
import * as Path from 'path';
import { Plugin } from 'vite';

export interface DomainOptions {
	name: string;
	path: string;
	allowed: Array<string>;
}

export function domainEnforcerPlugin(domains: Array<DomainOptions>): Plugin {
	validateDomainOptions(domains);

	return {
		name: 'domain-enforcer',
		resolveId: getResolveIdHandler(domains)
	};
}

function validateDomainOptions(domains: Array<DomainOptions>): void {
	const domainNames = new Set(domains.map(domain => domain.name));

	for (const domain of domains) {

		if (!Path.isAbsolute(domain.path)) {
			throw new Error(`Domain "${domain.name}" path "${domain.path}" isn't absolute`);
		}

		for (const allowedDomain of domain.allowed) {
			if (!domainNames.has(allowedDomain)) {
				throw new Error(`Domain "${allowedDomain}" isn't defined. Used in "${domain}"`);
			}
		}
	}
}

function getResolveIdHandler(domains: Array<DomainOptions>): Plugin['resolveId'] {
	return {
		order: 'pre',
		async handler(id, importer, options) {
			if (!importer) {
				return null;
			}

			if (id.startsWith('\0')) {
				return null;
			}

			const idOnlyPath = id.replace(/\?.*/, '');
			if (idOnlyPath.endsWith('.html')) {
				return null;
			}

			if (idOnlyPath === importer.replace(/\?.*/, '')) {
				return null;
			}

			if (options.custom?.skipDomainEnforcer) {
				return null;
			}
			const absoluteId = (await this.resolve(id, importer, { ...options, custom: { ...options.custom, skipDomainEnforcer: true } }))?.id;

			if (!absoluteId) {
				return null;
			}

			try {
				validateDomains(absoluteId, importer, domains, !Path.isAbsolute(id));
			} catch(error: unknown) {
				const rollupError = error instanceof Error ? error.message : `${error}`;
				this.error(rollupError);
			}
		}
	}
}

function validateDomains(absoluteId: string, importer: string, domains: Array<DomainOptions>, wasImportRelative: boolean): void {
	const domain = getDomain(absoluteId, domains);
	const importerDomain = getDomain(importer, domains);

	if (!domain || !importerDomain) {
		return;
	}

	if (domain === importerDomain) {
		if (!wasImportRelative) {
			throw new Error(`File "${absoluteId}" [${domain.name}] must be imported by relative path from "${importer}".`);
		}
		return null;
	}

	if (!importerDomain.allowed.includes(domain.name)) {
		throw new Error(`File "${absoluteId}" [${domain.name}] can't be imported from "${importer}" [${importerDomain.name}].`);
	}
}

function getDomain(absoluteId: string, domains: Array<DomainOptions>): DomainOptions | null {
	const normalized = Path.normalize(absoluteId);
	return domains.find(domain => normalized.startsWith(domain.path)) ?? null;
}

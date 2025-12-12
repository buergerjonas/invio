import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface CloudflareEnv {
	DB: D1Database;
}

export function getDB(): D1Database {
	const context = getCloudflareContext<CloudflareEnv>();
	if (!context?.env?.DB) {
		throw new Error("D1 database not available. Make sure DB binding is configured.");
	}
	return context.env.DB;
}


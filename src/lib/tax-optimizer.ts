import { getDB } from "./db";

export interface AssetLocation {
	accountType: string;
	asset: string;
	currentLocation: string;
	recommendedLocation: string;
	reason: string;
	taxSavings: number;
}

export interface TaxOptimization {
	id: string;
	user_id: string;
	portfolio_id: string | null;
	optimization_type: string;
	current_data: string;
	optimized_data: string;
	tax_savings: number;
	created_at: number;
}

function generateId(): string {
	return crypto.randomUUID();
}

// Tax-efficient asset location rules
const ASSET_LOCATION_RULES = {
	// High tax-efficiency assets go in taxable accounts
	taxable: [
		"Total Stock Market Index",
		"S&P 500 Index",
		"Large Cap Index",
		"International Stock Index",
		"Municipal Bonds",
	],
	// Tax-inefficient assets go in tax-advantaged accounts
	tax_advantaged: [
		"REITs",
		"High-Yield Bonds",
		"Corporate Bonds",
		"TIPS",
		"Commodities",
		"Actively Managed Funds",
	],
	// Bonds can go in either, but prefer tax-advantaged
	bonds: ["Total Bond Market", "Treasury Bonds", "Corporate Bonds"],
};

export function optimizeAssetLocation(
	currentHoldings: Record<string, { account: string; assets: string[] }>
): AssetLocation[] {
	const optimizations: AssetLocation[] = [];

	// Analyze each account
	for (const [accountType, holdings] of Object.entries(currentHoldings)) {
		for (const asset of holdings.assets) {
			const recommendedLocation = getRecommendedLocation(asset, accountType);
			if (recommendedLocation !== accountType) {
				const taxSavings = calculateTaxSavings(asset, accountType, recommendedLocation);
				optimizations.push({
					accountType,
					asset,
					currentLocation: accountType,
					recommendedLocation,
					reason: getReason(asset, accountType, recommendedLocation),
					taxSavings,
				});
			}
		}
	}

	return optimizations.sort((a, b) => b.taxSavings - a.taxSavings);
}

function getRecommendedLocation(asset: string, currentLocation: string): string {
	const assetLower = asset.toLowerCase();

	// Check if it's a tax-efficient asset (should be in taxable)
	if (
		ASSET_LOCATION_RULES.taxable.some((a) =>
			assetLower.includes(a.toLowerCase())
		)
	) {
		return "taxable";
	}

	// Check if it's tax-inefficient (should be in tax-advantaged)
	if (
		ASSET_LOCATION_RULES.tax_advantaged.some((a) =>
			assetLower.includes(a.toLowerCase())
		)
	) {
		// Prefer Roth for tax-inefficient assets
		return "roth_ira";
	}

	// Bonds prefer tax-advantaged
	if (
		ASSET_LOCATION_RULES.bonds.some((a) =>
			assetLower.includes(a.toLowerCase())
		)
	) {
		return currentLocation === "taxable" ? "ira" : currentLocation;
	}

	// Default: keep in current location if no specific rule
	return currentLocation;
}

function getReason(
	asset: string,
	currentLocation: string,
	recommendedLocation: string
): string {
	if (recommendedLocation === "taxable") {
		return "This asset is tax-efficient and should be in taxable accounts to maximize tax-advantaged space for less efficient assets.";
	}
	if (recommendedLocation === "roth_ira" || recommendedLocation === "ira") {
		return "This asset generates significant taxable income/dividends. Moving it to a tax-advantaged account will reduce tax drag.";
	}
	return "Optimize asset location to reduce overall tax burden.";
}

function calculateTaxSavings(
	asset: string,
	currentLocation: string,
	recommendedLocation: string
): number {
	// Simplified tax savings calculation
	// In reality, this would consider dividend yield, turnover, tax brackets, etc.

	if (currentLocation === "taxable" && recommendedLocation !== "taxable") {
		// Moving from taxable to tax-advantaged saves on dividends/capital gains
		// Estimate: 15-20% of annual returns saved
		return 500; // Placeholder - would calculate based on asset characteristics
	}

	if (currentLocation !== "taxable" && recommendedLocation === "taxable") {
		// Freeing up tax-advantaged space for less efficient assets
		return 300; // Placeholder
	}

	return 200; // Placeholder for other optimizations
}

export async function saveTaxOptimization(
	userId: string,
	currentData: Record<string, any>,
	optimizedData: AssetLocation[],
	portfolioId?: string
): Promise<TaxOptimization> {
	const db = getDB();
	const optimizationId = generateId();
	const totalTaxSavings = optimizedData.reduce(
		(sum, opt) => sum + opt.taxSavings,
		0
	);

	await db
		.prepare(
			"INSERT INTO tax_optimizations (id, user_id, portfolio_id, optimization_type, current_data, optimized_data, tax_savings, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
		)
		.bind(
			optimizationId,
			userId,
			portfolioId || null,
			"asset_location",
			JSON.stringify(currentData),
			JSON.stringify(optimizedData),
			totalTaxSavings,
			Date.now()
		)
		.run();

	return {
		id: optimizationId,
		user_id: userId,
		portfolio_id: portfolioId || null,
		optimization_type: "asset_location",
		current_data: JSON.stringify(currentData),
		optimized_data: JSON.stringify(optimizedData),
		tax_savings: totalTaxSavings,
		created_at: Date.now(),
	};
}

export async function getUserTaxOptimizations(
	userId: string
): Promise<TaxOptimization[]> {
	const db = getDB();
	const optimizations = await db
		.prepare(
			"SELECT * FROM tax_optimizations WHERE user_id = ? ORDER BY created_at DESC"
		)
		.bind(userId)
		.all<TaxOptimization>();

	return optimizations.results || [];
}


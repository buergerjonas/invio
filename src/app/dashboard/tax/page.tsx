"use client";

import { useState } from "react";

interface AssetLocation {
	accountType: string;
	asset: string;
	currentLocation: string;
	recommendedLocation: string;
	reason: string;
	taxSavings: number;
}

export default function TaxOptimizerPage() {
	const [holdings, setHoldings] = useState({
		taxable: { assets: ["Total Stock Market Index"] },
		ira: { assets: ["REITs", "High-Yield Bonds"] },
		roth_ira: { assets: ["Small Cap Index"] },
	});
	const [optimizations, setOptimizations] = useState<AssetLocation[]>([]);
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);

	const handleOptimize = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/tax/optimize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ holdings }),
			});

			if (response.ok) {
				const data = await response.json();
				setOptimizations(data.optimizations || []);
				setShowResults(true);
			}
		} catch (error) {
			console.error("Error optimizing:", error);
		} finally {
			setLoading(false);
		}
	};

	const addAsset = (accountType: string) => {
		const assetName = prompt("Enter asset name:");
		if (assetName) {
			setHoldings({
				...holdings,
				[accountType]: {
					assets: [...holdings[accountType as keyof typeof holdings].assets, assetName],
				},
			});
		}
	};

	const removeAsset = (accountType: string, index: number) => {
		const accountHoldings = holdings[accountType as keyof typeof holdings];
		setHoldings({
			...holdings,
			[accountType]: {
				assets: accountHoldings.assets.filter((_, i) => i !== index),
			},
		});
	};

	const totalTaxSavings = optimizations.reduce(
		(sum, opt) => sum + opt.taxSavings,
		0
	);

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Tax Optimizer
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Optimize asset location to minimize taxes and maximize after-tax returns
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				{/* Current Holdings */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Current Asset Location
					</h2>
					<div className="space-y-4">
						{Object.entries(holdings).map(([accountType, account]) => (
							<div
								key={accountType}
								className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
							>
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-medium text-slate-900 dark:text-slate-100 capitalize">
										{accountType.replace("_", " ")}
									</h3>
									<button
										onClick={() => addAsset(accountType)}
										className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
									>
										+ Add Asset
									</button>
								</div>
								<div className="space-y-2">
									{account.assets.map((asset, index) => (
										<div
											key={index}
											className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-900 rounded px-3 py-2"
										>
											<span className="text-slate-700 dark:text-slate-300">
												{asset}
											</span>
											<button
												onClick={() => removeAsset(accountType, index)}
												className="text-red-600 dark:text-red-400 hover:text-red-700"
											>
												×
											</button>
										</div>
									))}
									{account.assets.length === 0 && (
										<p className="text-sm text-slate-500 dark:text-slate-400 italic">
											No assets
										</p>
									)}
								</div>
							</div>
						))}
					</div>
					<button
						onClick={handleOptimize}
						disabled={loading}
						className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
					>
						{loading ? "Optimizing..." : "Optimize Asset Location"}
					</button>
				</div>

				{/* Optimization Results */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Optimization Results
					</h2>
					{showResults && optimizations.length > 0 ? (
						<div className="space-y-6">
							<div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
								<div className="text-sm text-emerald-800 dark:text-emerald-200 mb-1">
									Estimated Annual Tax Savings
								</div>
								<div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
									${totalTaxSavings.toLocaleString()}
								</div>
							</div>

							<div>
								<h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
									Recommended Changes
								</h3>
								<div className="space-y-3">
									{optimizations.map((opt, index) => (
										<div
											key={index}
											className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
										>
											<div className="flex items-start justify-between mb-2">
												<div className="flex-1">
													<div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
														{opt.asset}
													</div>
													<div className="text-sm text-slate-600 dark:text-slate-400">
														Move from{" "}
														<span className="font-medium capitalize">
															{opt.currentLocation.replace("_", " ")}
														</span>{" "}
														to{" "}
														<span className="font-medium text-emerald-600 dark:text-emerald-400 capitalize">
															{opt.recommendedLocation.replace("_", " ")}
														</span>
													</div>
													<p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
														{opt.reason}
													</p>
												</div>
												<div className="text-right ml-4">
													<div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
														${opt.taxSavings.toLocaleString()}
													</div>
													<div className="text-xs text-slate-500 dark:text-slate-400">
														savings/yr
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
								<div className="text-sm text-blue-800 dark:text-blue-200">
									💡 <strong>Note:</strong> These are estimates. Actual tax savings depend on
									your tax bracket, dividend yields, and other factors. Consult a tax
									professional for personalized advice.
								</div>
							</div>
						</div>
					) : showResults && optimizations.length === 0 ? (
						<div className="text-center py-12 text-slate-500 dark:text-slate-400">
							Your asset location is already optimized! 🎉
						</div>
					) : (
						<div className="text-center py-12 text-slate-500 dark:text-slate-400">
							Enter your current holdings and click "Optimize" to see recommendations
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

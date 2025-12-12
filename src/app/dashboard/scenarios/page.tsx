"use client";

import { useState } from "react";

type ScenarioType =
	| "house_purchase"
	| "market_crash"
	| "sabbatical"
	| "savings_change"
	| "custom";

export default function ScenariosPage() {
	const [scenarioType, setScenarioType] = useState<ScenarioType>("house_purchase");
	const [inputs, setInputs] = useState({
		currentSavings: 100000,
		annualIncome: 100000,
		annualExpenses: 60000,
		monthlySavings: 2000,
		housePrice: 500000,
		downPayment: 100000,
		marketCrashPercent: 30,
		sabbaticalMonths: 12,
		savingsChangePercent: 10,
	});
	const [results, setResults] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleRunScenario = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/scenarios/run", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ scenario_type: scenarioType, inputs }),
			});

			if (response.ok) {
				const data = await response.json();
				setResults(data);
			}
		} catch (error) {
			console.error("Error running scenario:", error);
		} finally {
			setLoading(false);
		}
	};

	const scenarios = [
		{
			value: "house_purchase",
			label: "House Purchase",
			icon: "🏠",
			description: "What if I buy a house?",
		},
		{
			value: "market_crash",
			label: "Market Crash",
			icon: "📉",
			description: "What if markets drop 30%?",
		},
		{
			value: "sabbatical",
			label: "Sabbatical",
			icon: "✈️",
			description: "What if I take a year off?",
		},
		{
			value: "savings_change",
			label: "Savings Change",
			icon: "💰",
			description: "What if I save more/less?",
		},
	];

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Scenario Engine
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Test "what if" scenarios for your financial future
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				{/* Scenario Selection & Inputs */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Choose Scenario
					</h2>
					<div className="grid grid-cols-2 gap-3 mb-6">
						{scenarios.map((scenario) => (
							<button
								key={scenario.value}
								onClick={() => setScenarioType(scenario.value as ScenarioType)}
								className={`p-4 rounded-lg border-2 text-center transition-colors ${
									scenarioType === scenario.value
										? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
										: "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
								}`}
							>
								<div className="text-2xl mb-1">{scenario.icon}</div>
								<div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
									{scenario.label}
								</div>
							</button>
						))}
					</div>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Base Assumptions
					</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Current Savings ($)
							</label>
							<input
								type="number"
								value={inputs.currentSavings}
								onChange={(e) =>
									setInputs({ ...inputs, currentSavings: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Annual Income ($)
							</label>
							<input
								type="number"
								value={inputs.annualIncome}
								onChange={(e) =>
									setInputs({ ...inputs, annualIncome: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Monthly Savings ($)
							</label>
							<input
								type="number"
								value={inputs.monthlySavings}
								onChange={(e) =>
									setInputs({ ...inputs, monthlySavings: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>

						{scenarioType === "house_purchase" && (
							<>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										House Price ($)
									</label>
									<input
										type="number"
										value={inputs.housePrice}
										onChange={(e) =>
											setInputs({ ...inputs, housePrice: parseInt(e.target.value) })
										}
										className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Down Payment ($)
									</label>
									<input
										type="number"
										value={inputs.downPayment}
										onChange={(e) =>
											setInputs({ ...inputs, downPayment: parseInt(e.target.value) })
										}
										className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
									/>
								</div>
							</>
						)}

						{scenarioType === "market_crash" && (
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Market Drop (%)
								</label>
								<input
									type="number"
									value={inputs.marketCrashPercent}
									onChange={(e) =>
										setInputs({
											...inputs,
											marketCrashPercent: parseInt(e.target.value),
										})
									}
									className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								/>
							</div>
						)}

						{scenarioType === "sabbatical" && (
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Months Off Work
								</label>
								<input
									type="number"
									value={inputs.sabbaticalMonths}
									onChange={(e) =>
										setInputs({
											...inputs,
											sabbaticalMonths: parseInt(e.target.value),
										})
									}
									className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								/>
							</div>
						)}

						{scenarioType === "savings_change" && (
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Savings Change (%)
								</label>
								<input
									type="number"
									value={inputs.savingsChangePercent}
									onChange={(e) =>
										setInputs({
											...inputs,
											savingsChangePercent: parseInt(e.target.value),
										})
									}
									className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								/>
								<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
									Positive = increase, Negative = decrease
								</p>
							</div>
						)}

						<button
							onClick={handleRunScenario}
							disabled={loading}
							className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
						>
							{loading ? "Running Scenario..." : "Run Scenario"}
						</button>
					</div>
				</div>

				{/* Results */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Scenario Results
					</h2>
					{results ? (
						<div className="space-y-6">
							<div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
								<div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
									Scenario: {scenarios.find((s) => s.value === scenarioType)?.label}
								</div>
								<div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
									{results.impact}
								</div>
							</div>

							<div className="space-y-4">
								{results.before && (
									<div>
										<div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
											Before Scenario
										</div>
										<div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 space-y-2">
											{Object.entries(results.before).map(([key, value]) => (
												<div
													key={key}
													className="flex justify-between text-sm"
												>
													<span className="text-slate-600 dark:text-slate-400 capitalize">
														{key.replace(/([A-Z])/g, " $1").trim()}:
													</span>
													<span className="font-medium text-slate-900 dark:text-slate-100">
														{typeof value === "number"
															? `$${value.toLocaleString()}`
															: String(value)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}

								{results.after && (
									<div>
										<div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
											After Scenario
										</div>
										<div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 space-y-2">
											{Object.entries(results.after).map(([key, value]) => (
												<div
													key={key}
													className="flex justify-between text-sm"
												>
													<span className="text-slate-600 dark:text-slate-400 capitalize">
														{key.replace(/([A-Z])/g, " $1").trim()}:
													</span>
													<span className="font-medium text-slate-900 dark:text-slate-100">
														{typeof value === "number"
															? `$${value.toLocaleString()}`
															: String(value)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}

								{results.recommendations && results.recommendations.length > 0 && (
									<div>
										<div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
											Recommendations
										</div>
										<div className="space-y-2">
											{results.recommendations.map(
												(rec: string, i: number) => (
													<div
														key={i}
														className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 rounded p-2"
													>
														<span className="text-blue-600 dark:text-blue-400">
															•
														</span>
														<span>{rec}</span>
													</div>
												)
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="text-center py-12 text-slate-500 dark:text-slate-400">
							Select a scenario and click "Run Scenario" to see the impact
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

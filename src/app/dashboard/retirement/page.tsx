"use client";

import { useState } from "react";

type PlanType = "fire" | "coast_fire" | "traditional" | "barista_fire";

export default function RetirementPlannerPage() {
	const [planType, setPlanType] = useState<PlanType>("fire");
	const [inputs, setInputs] = useState({
		currentAge: 30,
		retirementAge: 65,
		currentSavings: 50000,
		annualIncome: 100000,
		annualExpenses: 60000,
		savingsRate: 20,
		expectedReturn: 7,
		inflationRate: 3,
	});
	const [results, setResults] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleCalculate = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/retirement/calculate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan_type: planType, inputs }),
			});

			if (response.ok) {
				const data = await response.json();
				setResults(data);
			}
		} catch (error) {
			console.error("Error calculating:", error);
		} finally {
			setLoading(false);
		}
	};

	const planTypes = [
		{ value: "fire", label: "FIRE", description: "Financial Independence, Retire Early" },
		{ value: "coast_fire", label: "Coast FIRE", description: "Enough saved to coast to retirement" },
		{ value: "traditional", label: "Traditional", description: "Standard retirement planning" },
		{ value: "barista_fire", label: "Barista FIRE", description: "Part-time work, reduced expenses" },
	];

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Retirement Planner
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Plan your path to FIRE, Coast FIRE, or traditional retirement
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				{/* Input Form */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Plan Type
					</h2>
					<div className="grid grid-cols-2 gap-3 mb-6">
						{planTypes.map((type) => (
							<button
								key={type.value}
								onClick={() => setPlanType(type.value as PlanType)}
								className={`p-3 rounded-lg border-2 text-left transition-colors ${
									planType === type.value
										? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
										: "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
								}`}
							>
								<div className="font-semibold text-slate-900 dark:text-slate-100">
									{type.label}
								</div>
								<div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
									{type.description}
								</div>
							</button>
						))}
					</div>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Your Information
					</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Current Age
							</label>
							<input
								type="number"
								value={inputs.currentAge}
								onChange={(e) =>
									setInputs({ ...inputs, currentAge: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Target Retirement Age
							</label>
							<input
								type="number"
								value={inputs.retirementAge}
								onChange={(e) =>
									setInputs({ ...inputs, retirementAge: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
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
								Annual Expenses ($)
							</label>
							<input
								type="number"
								value={inputs.annualExpenses}
								onChange={(e) =>
									setInputs({ ...inputs, annualExpenses: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Savings Rate (%)
							</label>
							<input
								type="number"
								value={inputs.savingsRate}
								onChange={(e) =>
									setInputs({ ...inputs, savingsRate: parseFloat(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Expected Annual Return (%)
							</label>
							<input
								type="number"
								step="0.1"
								value={inputs.expectedReturn}
								onChange={(e) =>
									setInputs({ ...inputs, expectedReturn: parseFloat(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
							/>
						</div>
						<button
							onClick={handleCalculate}
							disabled={loading}
							className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
						>
							{loading ? "Calculating..." : "Calculate Retirement Plan"}
						</button>
					</div>
				</div>

				{/* Results */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Projections
					</h2>
					{results ? (
						<div className="space-y-6">
							<div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
								<div className="text-sm text-emerald-800 dark:text-emerald-200 mb-1">
									Years to Retirement
								</div>
								<div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
									{results.yearsToRetirement} years
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<div className="flex justify-between mb-1">
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Target Amount Needed
										</span>
										<span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
											${results.targetAmount?.toLocaleString()}
										</span>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-1">
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Projected Savings at Retirement
										</span>
										<span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
											${results.projectedSavings?.toLocaleString()}
										</span>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-1">
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Monthly Savings Needed
										</span>
										<span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
											${results.monthlySavings?.toLocaleString()}
										</span>
									</div>
								</div>
								{results.coastFireAge && (
									<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
										<div className="text-sm text-blue-800 dark:text-blue-200 mb-1">
											Coast FIRE Age
										</div>
										<div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
											{results.coastFireAge} years old
										</div>
										<div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
											You can stop saving at this age and still reach your goal
										</div>
									</div>
								)}
							</div>

							{results.milestones && results.milestones.length > 0 && (
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
										Milestones
									</h3>
									<div className="space-y-2">
										{results.milestones.map((milestone: string, i: number) => (
											<div
												key={i}
												className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
											>
												<span className="text-emerald-600 dark:text-emerald-400">•</span>
												<span>{milestone}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-12 text-slate-500 dark:text-slate-400">
							Enter your information and click "Calculate" to see your retirement projections
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

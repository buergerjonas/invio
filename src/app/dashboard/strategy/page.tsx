"use client";

import { useState } from "react";
import Link from "next/link";

interface QuestionnaireData {
	age: number;
	income: number;
	debt: number;
	riskTolerance: "conservative" | "moderate" | "aggressive";
	retirementAge: number;
	currentSavings: number;
	has401k: boolean;
	hasIRA: boolean;
	hasRothIRA: boolean;
	hasHSA: boolean;
	hasTaxable: boolean;
}

export default function StrategyDesignerPage() {
	const [step, setStep] = useState(1);
	const [data, setData] = useState<Partial<QuestionnaireData>>({});
	const [strategy, setStrategy] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleNext = () => {
		if (step < 5) {
			setStep(step + 1);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/strategy/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			setStrategy(result);
			setStep(6); // Show results
		} catch (error) {
			console.error("Error generating strategy:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Investment Strategy Designer
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Answer a few questions to get your personalized investment plan
				</p>
			</div>

			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-slate-600 dark:text-slate-400">
						Step {step} of 5
					</span>
					<span className="text-sm text-slate-600 dark:text-slate-400">
						{Math.round((step / 5) * 100)}%
					</span>
				</div>
				<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
					<div
						className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
						style={{ width: `${(step / 5) * 100}%` }}
					/>
				</div>
			</div>

			{/* Questionnaire Steps */}
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
				{step === 1 && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Basic Information
						</h2>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Age
							</label>
							<input
								type="number"
								value={data.age || ""}
								onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								min="18"
								max="100"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Annual Income ($)
							</label>
							<input
								type="number"
								value={data.income || ""}
								onChange={(e) => setData({ ...data, income: parseInt(e.target.value) })}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								min="0"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Total Debt ($)
							</label>
							<input
								type="number"
								value={data.debt || ""}
								onChange={(e) => setData({ ...data, debt: parseInt(e.target.value) })}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								min="0"
							/>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Risk Tolerance
						</h2>
						<div className="space-y-4">
							{(["conservative", "moderate", "aggressive"] as const).map((risk) => (
								<label
									key={risk}
									className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
										data.riskTolerance === risk
											? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
											: "border-slate-300 dark:border-slate-700 hover:border-emerald-300"
									}`}
								>
									<input
										type="radio"
										name="riskTolerance"
										value={risk}
										checked={data.riskTolerance === risk}
										onChange={(e) =>
											setData({ ...data, riskTolerance: e.target.value as any })
										}
										className="mr-3"
									/>
									<span className="font-medium capitalize text-slate-900 dark:text-slate-100">
										{risk}
									</span>
									<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
										{risk === "conservative" &&
											"Lower risk, stable returns"}
										{risk === "moderate" &&
											"Balanced risk and return"}
										{risk === "aggressive" &&
											"Higher risk, potential for higher returns"}
									</p>
								</label>
							))}
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Retirement Goals
						</h2>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Target Retirement Age
							</label>
							<input
								type="number"
								value={data.retirementAge || ""}
								onChange={(e) =>
									setData({ ...data, retirementAge: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								min="50"
								max="80"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Current Savings ($)
							</label>
							<input
								type="number"
								value={data.currentSavings || ""}
								onChange={(e) =>
									setData({ ...data, currentSavings: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								min="0"
							/>
						</div>
					</div>
				)}

				{step === 4 && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Account Access
						</h2>
						<p className="text-slate-600 dark:text-slate-400">
							Which types of accounts do you have access to or can open?
						</p>
						<div className="space-y-3">
							{[
								{ key: "has401k", label: "401(k) or 403(b)" },
								{ key: "hasIRA", label: "Traditional IRA" },
								{ key: "hasRothIRA", label: "Roth IRA" },
								{ key: "hasHSA", label: "HSA (Health Savings Account)" },
								{ key: "hasTaxable", label: "Taxable Brokerage Account" },
							].map(({ key, label }) => (
								<label
									key={key}
									className="flex items-center p-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
								>
									<input
										type="checkbox"
										checked={(data as any)[key] || false}
										onChange={(e) =>
											setData({ ...data, [key]: e.target.checked })
										}
										className="mr-3"
									/>
									<span className="text-slate-900 dark:text-slate-100">{label}</span>
								</label>
							))}
						</div>
					</div>
				)}

				{step === 5 && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Review Your Information
						</h2>
						<div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
							<div className="flex justify-between">
								<span className="text-slate-600 dark:text-slate-400">Age:</span>
								<span className="font-medium text-slate-900 dark:text-slate-100">
									{data.age}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-600 dark:text-slate-400">Annual Income:</span>
								<span className="font-medium text-slate-900 dark:text-slate-100">
									${data.income?.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-600 dark:text-slate-400">Risk Tolerance:</span>
								<span className="font-medium capitalize text-slate-900 dark:text-slate-100">
									{data.riskTolerance}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-600 dark:text-slate-400">
									Retirement Age:
								</span>
								<span className="font-medium text-slate-900 dark:text-slate-100">
									{data.retirementAge}
								</span>
							</div>
						</div>
					</div>
				)}

				{step === 6 && strategy && (
					<div className="space-y-6">
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Your Investment Strategy
						</h2>
						<div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
							<p className="text-emerald-800 dark:text-emerald-200">
								Strategy generated successfully! This is a placeholder. The full strategy
								would include:
							</p>
							<ul className="mt-4 space-y-2 text-emerald-700 dark:text-emerald-300">
								<li>• Investment ladder (priority order)</li>
								<li>• Account priorities</li>
								<li>• Recommended contributions</li>
								<li>• Asset allocation</li>
								<li>• Expected timeline</li>
							</ul>
						</div>
					</div>
				)}

				{/* Navigation Buttons */}
				{step < 6 && (
					<div className="flex justify-between mt-8">
						<button
							onClick={handleBack}
							disabled={step === 1}
							className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Back
						</button>
						{step < 5 ? (
							<button
								onClick={handleNext}
								className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
							>
								Next
							</button>
						) : (
							<button
								onClick={handleSubmit}
								disabled={loading}
								className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Generating..." : "Generate Strategy"}
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}


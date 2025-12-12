"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Account {
	id: string;
	account_type: string;
	name: string;
	status: string;
	broker: string | null;
}

interface SetupStep {
	id: string;
	account_id: string;
	title: string;
	description: string | null;
	status: string;
	due_date: number | null;
}

export default function AccountSetupPage() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newAccountType, setNewAccountType] = useState("");
	const [newAccountName, setNewAccountName] = useState("");

	useEffect(() => {
		loadAccounts();
	}, []);

	const loadAccounts = async () => {
		try {
			const response = await fetch("/api/accounts");
			if (response.ok) {
				const data = await response.json();
				setAccounts(data.accounts || []);
			}
		} catch (error) {
			console.error("Error loading accounts:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddAccount = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newAccountType || !newAccountName) return;

		try {
			const response = await fetch("/api/accounts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					account_type: newAccountType,
					name: newAccountName,
				}),
			});

			if (response.ok) {
				setNewAccountType("");
				setNewAccountName("");
				setShowAddForm(false);
				loadAccounts();
			}
		} catch (error) {
			console.error("Error creating account:", error);
		}
	};

	const accountTypes = [
		{ value: "401k", label: "401(k)" },
		{ value: "403b", label: "403(b)" },
		{ value: "457", label: "457" },
		{ value: "ira", label: "Traditional IRA" },
		{ value: "roth_ira", label: "Roth IRA" },
		{ value: "hsa", label: "HSA" },
		{ value: "taxable", label: "Taxable Brokerage" },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "invested":
				return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
			case "funded":
				return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
			case "opened":
				return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
			default:
				return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200";
		}
	};

	if (loading) {
		return (
			<div className="max-w-6xl mx-auto">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
						Account Setup Assistant
					</h1>
					<p className="text-slate-600 dark:text-slate-400">
						Get step-by-step guidance on opening and funding your investment accounts
					</p>
				</div>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
				>
					+ Add Account
				</button>
			</div>

			{/* Add Account Form */}
			{showAddForm && (
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Add New Account
					</h2>
					<form onSubmit={handleAddAccount} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Account Type
							</label>
							<select
								value={newAccountType}
								onChange={(e) => setNewAccountType(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								required
							>
								<option value="">Select account type...</option>
								{accountTypes.map((type) => (
									<option key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Account Name
							</label>
							<input
								type="text"
								value={newAccountName}
								onChange={(e) => setNewAccountName(e.target.value)}
								placeholder="e.g., My Roth IRA"
								className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
								required
							/>
						</div>
						<div className="flex gap-3">
							<button
								type="submit"
								className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
							>
								Create Account
							</button>
							<button
								type="button"
								onClick={() => {
									setShowAddForm(false);
									setNewAccountType("");
									setNewAccountName("");
								}}
								className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Accounts List */}
			{accounts.length === 0 ? (
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
					<div className="text-6xl mb-4">🏦</div>
					<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
						No accounts yet
					</h2>
					<p className="text-slate-600 dark:text-slate-400 mb-6">
						Add your first account to get started with step-by-step setup guidance
					</p>
					<button
						onClick={() => setShowAddForm(true)}
						className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
					>
						Add Your First Account
					</button>
				</div>
			) : (
				<div className="grid gap-6">
					{accounts.map((account) => (
						<AccountCard key={account.id} account={account} />
					))}
				</div>
			)}
		</div>
	);
}

function AccountCard({ account }: { account: Account }) {
	const [steps, setSteps] = useState<SetupStep[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadSteps();
	}, [account.id]);

	const loadSteps = async () => {
		try {
			const response = await fetch(`/api/accounts/${account.id}/steps`);
			if (response.ok) {
				const data = await response.json();
				setSteps(data.steps || []);
			}
		} catch (error) {
			console.error("Error loading steps:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStepStatus = async (stepId: string, status: string) => {
		try {
			const response = await fetch(`/api/accounts/steps/${stepId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});

			if (response.ok) {
				loadSteps();
			}
		} catch (error) {
			console.error("Error updating step:", error);
		}
	};

	const completedSteps = steps.filter((s) => s.status === "completed").length;
	const totalSteps = steps.length;
	const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700";
			case "in_progress":
				return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700";
			default:
				return "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
		}
	};

	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
						{account.name}
					</h3>
					<p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
						{account.account_type.replace("_", " ")}
					</p>
				</div>
				<span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(account.status)}`}>
					{account.status}
				</span>
			</div>

			{/* Progress Bar */}
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-slate-600 dark:text-slate-400">
						Setup Progress
					</span>
					<span className="text-sm font-medium text-slate-900 dark:text-slate-100">
						{completedSteps} / {totalSteps} steps
					</span>
				</div>
				<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
					<div
						className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Steps List */}
			{loading ? (
				<div className="text-center py-4">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
				</div>
			) : steps.length > 0 ? (
				<div className="space-y-3">
					{steps.map((step, index) => (
						<div
							key={step.id}
							className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-1">
										<span className="text-sm font-medium">
											{index + 1}. {step.title}
										</span>
										{step.due_date && (
											<span className="text-xs text-slate-500 dark:text-slate-400">
												Due: {new Date(step.due_date).toLocaleDateString()}
											</span>
										)}
									</div>
									{step.description && (
										<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
											{step.description}
										</p>
									)}
								</div>
								<div className="flex gap-2 ml-4">
									{step.status === "pending" && (
										<button
											onClick={() => updateStepStatus(step.id, "in_progress")}
											className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
										>
											Start
										</button>
									)}
									{step.status === "in_progress" && (
										<button
											onClick={() => updateStepStatus(step.id, "completed")}
											className="px-3 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors"
										>
											Complete
										</button>
									)}
									{step.status === "completed" && (
										<span className="text-emerald-600 dark:text-emerald-400">✓</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-slate-600 dark:text-slate-400 text-sm">
					No setup steps available
				</p>
			)}
		</div>
	);
}

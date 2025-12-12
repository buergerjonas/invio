import { getDB } from "./db";

export type AccountType = "401k" | "ira" | "roth_ira" | "hsa" | "taxable" | "403b" | "457" | "other";
export type AccountStatus = "planned" | "opened" | "funded" | "invested";

export interface Account {
	id: string;
	user_id: string;
	strategy_id: string | null;
	account_type: AccountType;
	name: string;
	broker: string | null;
	balance: number;
	target_allocation: string | null;
	status: AccountStatus;
	created_at: number;
	updated_at: number;
}

export interface SetupStep {
	id: string;
	account_id: string;
	step_type: string;
	title: string;
	description: string | null;
	status: "pending" | "in_progress" | "completed" | "skipped";
	due_date: number | null;
	completed_at: number | null;
	created_at: number;
}

function generateId(): string {
	return crypto.randomUUID();
}

export async function getUserAccounts(userId: string): Promise<Account[]> {
	const db = getDB();
	const accounts = await db
		.prepare("SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC")
		.bind(userId)
		.all<Account>();

	return accounts.results || [];
}

export async function getAccountById(accountId: string): Promise<Account | null> {
	const db = getDB();
	const account = await db
		.prepare("SELECT * FROM accounts WHERE id = ?")
		.bind(accountId)
		.first<Account>();

	return account || null;
}

export async function createAccount(
	userId: string,
	accountType: AccountType,
	name: string,
	strategyId?: string
): Promise<Account> {
	const db = getDB();
	const accountId = generateId();
	const now = Date.now();

	await db
		.prepare(
			"INSERT INTO accounts (id, user_id, strategy_id, account_type, name, broker, balance, target_allocation, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
		)
		.bind(accountId, userId, strategyId || null, accountType, name, null, 0, null, "planned", now, now)
		.run();

	// Generate setup steps for this account
	await generateSetupSteps(accountId, accountType);

	const account = await getAccountById(accountId);
	if (!account) {
		throw new Error("Failed to create account");
	}

	return account;
}

export async function updateAccountStatus(
	accountId: string,
	status: AccountStatus
): Promise<void> {
	const db = getDB();
	await db
		.prepare("UPDATE accounts SET status = ?, updated_at = ? WHERE id = ?")
		.bind(status, Date.now(), accountId)
		.run();
}

export async function getAccountSetupSteps(accountId: string): Promise<SetupStep[]> {
	const db = getDB();
	const steps = await db
		.prepare("SELECT * FROM account_setup_steps WHERE account_id = ? ORDER BY created_at ASC")
		.bind(accountId)
		.all<SetupStep>();

	return steps.results || [];
}

export async function getSetupStepById(stepId: string): Promise<SetupStep | null> {
	const db = getDB();
	const step = await db
		.prepare("SELECT * FROM account_setup_steps WHERE id = ?")
		.bind(stepId)
		.first<SetupStep>();

	return step || null;
}

export async function updateStepStatus(
	stepId: string,
	status: "pending" | "in_progress" | "completed" | "skipped"
): Promise<void> {
	const db = getDB();
	const completedAt = status === "completed" ? Date.now() : null;
	await db
		.prepare("UPDATE account_setup_steps SET status = ?, completed_at = ? WHERE id = ?")
		.bind(status, completedAt, stepId)
		.run();
}

async function generateSetupSteps(accountId: string, accountType: AccountType): Promise<void> {
	const db = getDB();
	const steps = getStepsForAccountType(accountType);
	const now = Date.now();

	for (const step of steps) {
		const stepId = generateId();
		await db
			.prepare(
				"INSERT INTO account_setup_steps (id, account_id, step_type, title, description, status, due_date, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
			)
			.bind(
				stepId,
				accountId,
				step.stepType,
				step.title,
				step.description || null,
				"pending",
				step.dueDate || null,
				null,
				now
			)
			.run();
	}
}

function getStepsForAccountType(accountType: AccountType): Array<{
	stepType: string;
	title: string;
	description: string | null;
	dueDate: number | null;
}> {
	const currentYear = new Date().getFullYear();
	const rothDeadline = new Date(`${currentYear + 1}-04-15`).getTime(); // Tax day for previous year

	switch (accountType) {
		case "roth_ira":
			return [
				{
					stepType: "research",
					title: "Research Roth IRA providers",
					description: "Compare providers like Vanguard, Fidelity, Charles Schwab, or E*TRADE",
					dueDate: null,
				},
				{
					stepType: "open",
					title: "Open Roth IRA account",
					description: "Complete the account opening process online or by phone",
					dueDate: null,
				},
				{
					stepType: "fund",
					title: "Fund your Roth IRA",
					description: "Transfer money from your bank account (contribution limit: $7,000 for 2024)",
					dueDate: rothDeadline,
				},
				{
					stepType: "invest",
					title: "Invest your contribution",
					description: "Purchase investments (ETFs, mutual funds, etc.) within your Roth IRA",
					dueDate: null,
				},
				{
					stepType: "automate",
					title: "Set up automatic contributions",
					description: "Automate monthly contributions to stay on track",
					dueDate: null,
				},
			];

		case "ira":
			return [
				{
					stepType: "research",
					title: "Research Traditional IRA providers",
					description: "Compare providers and understand tax implications",
					dueDate: null,
				},
				{
					stepType: "open",
					title: "Open Traditional IRA account",
					description: "Complete the account opening process",
					dueDate: null,
				},
				{
					stepType: "fund",
					title: "Fund your Traditional IRA",
					description: "Make contributions (limit: $7,000 for 2024, or $8,000 if 50+)",
					dueDate: rothDeadline,
				},
				{
					stepType: "invest",
					title: "Invest your contribution",
					description: "Purchase investments within your IRA",
					dueDate: null,
				},
			];

		case "401k":
			return [
				{
					stepType: "enroll",
					title: "Enroll in your employer's 401(k)",
					description: "Contact HR or use your employer's benefits portal",
					dueDate: null,
				},
				{
					stepType: "contribute",
					title: "Set contribution percentage",
					description: "Aim for at least enough to get the full employer match",
					dueDate: null,
				},
				{
					stepType: "invest",
					title: "Select investments",
					description: "Choose low-cost index funds or target-date funds",
					dueDate: null,
				},
				{
					stepType: "increase",
					title: "Increase contributions over time",
					description: "Aim to max out ($23,000 for 2024) if possible",
					dueDate: null,
				},
			];

		case "hsa":
			return [
				{
					stepType: "eligibility",
					title: "Verify HSA eligibility",
					description: "Ensure you have a high-deductible health plan (HDHP)",
					dueDate: null,
				},
				{
					stepType: "open",
					title: "Open HSA account",
					description: "Your employer may offer one, or choose a provider like Fidelity",
					dueDate: null,
				},
				{
					stepType: "fund",
					title: "Fund your HSA",
					description: "Contribute up to $4,150 (individual) or $8,300 (family) for 2024",
					dueDate: rothDeadline,
				},
				{
					stepType: "invest",
					title: "Invest HSA funds",
					description: "Once you have enough for medical expenses, invest the rest",
					dueDate: null,
				},
			];

		case "taxable":
			return [
				{
					stepType: "research",
					title: "Choose a brokerage",
					description: "Compare Vanguard, Fidelity, Charles Schwab, or E*TRADE",
					dueDate: null,
				},
				{
					stepType: "open",
					title: "Open taxable brokerage account",
					description: "Complete account opening (usually takes 10-15 minutes)",
					dueDate: null,
				},
				{
					stepType: "fund",
					title: "Fund your account",
					description: "Transfer money from your bank account",
					dueDate: null,
				},
				{
					stepType: "invest",
					title: "Make your first investment",
					description: "Start with broad-market index funds or ETFs",
					dueDate: null,
				},
			];

		default:
			return [
				{
					stepType: "plan",
					title: "Plan your account setup",
					description: "Research requirements and steps for this account type",
					dueDate: null,
				},
			];
	}
}

export async function getUpcomingDeadlines(userId: string): Promise<SetupStep[]> {
	const db = getDB();
	const now = Date.now();
	const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

	const steps = await db
		.prepare(
			`SELECT s.* FROM account_setup_steps s
			 INNER JOIN accounts a ON s.account_id = a.id
			 WHERE a.user_id = ? 
			 AND s.due_date IS NOT NULL 
			 AND s.due_date <= ? 
			 AND s.status != 'completed'
			 ORDER BY s.due_date ASC`
		)
		.bind(userId, thirtyDaysFromNow)
		.all<SetupStep>();

	return steps.results || [];
}


import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier } from "@/lib/subscriptions";
import { getDB } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tier = await getUserTier(user.id);
		if (tier === "free") {
			return NextResponse.json(
				{ error: "Upgrade to Pro or Plus to generate full strategies" },
				{ status: 403 }
			);
		}

		const questionnaireData = await request.json();

		// Generate strategy based on questionnaire
		// This is a simplified version - you'd implement the full logic here
		const strategy = {
			investmentLadder: generateInvestmentLadder(questionnaireData),
			accountPriorities: generateAccountPriorities(questionnaireData),
			assetAllocation: generateAssetAllocation(questionnaireData),
			contributions: generateContributions(questionnaireData),
			timeline: generateTimeline(questionnaireData),
		};

		// Save strategy to database
		const db = getDB();
		const strategyId = crypto.randomUUID();
		await db
			.prepare(
				"INSERT INTO investment_strategies (id, user_id, name, questionnaire_data, strategy_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
			)
			.bind(
				strategyId,
				user.id,
				"My Investment Strategy",
				JSON.stringify(questionnaireData),
				JSON.stringify(strategy),
				Date.now(),
				Date.now()
			)
			.run();

		return NextResponse.json({ id: strategyId, ...strategy });
	} catch (error) {
		console.error("Strategy generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate strategy" },
			{ status: 500 }
		);
	}
}

function generateInvestmentLadder(data: any): string[] {
	const ladder = [];
	if (data.has401k) ladder.push("401(k) - Employer Match");
	if (data.hasHSA) ladder.push("HSA");
	if (data.hasRothIRA) ladder.push("Roth IRA");
	if (data.has401k) ladder.push("401(k) - Additional");
	if (data.hasIRA) ladder.push("Traditional IRA");
	if (data.hasTaxable) ladder.push("Taxable Brokerage");
	return ladder;
}

function generateAccountPriorities(data: any): Record<string, number> {
	const priorities: Record<string, number> = {};
	let priority = 1;
	if (data.has401k) priorities["401k"] = priority++;
	if (data.hasHSA) priorities["hsa"] = priority++;
	if (data.hasRothIRA) priorities["roth_ira"] = priority++;
	if (data.hasIRA) priorities["ira"] = priority++;
	if (data.hasTaxable) priorities["taxable"] = priority++;
	return priorities;
}

function generateAssetAllocation(data: any): Record<string, number> {
	const riskMap: Record<string, Record<string, number>> = {
		conservative: { stocks: 40, bonds: 50, cash: 10 },
		moderate: { stocks: 60, bonds: 35, cash: 5 },
		aggressive: { stocks: 80, bonds: 15, cash: 5 },
	};
	return riskMap[data.riskTolerance] || riskMap.moderate;
}

function generateContributions(data: any): Record<string, number> {
	const monthlyIncome = (data.income || 0) / 12;
	const savingsRate = 0.2; // 20% default
	const totalMonthly = monthlyIncome * savingsRate;

	return {
		monthly: Math.round(totalMonthly),
		annual: Math.round(totalMonthly * 12),
	};
}

function generateTimeline(data: any): { years: number; milestones: string[] } {
	const age = data.age || 30;
	const retirementAge = data.retirementAge || 65;
	const years = retirementAge - age;

	const milestones = [];
	if (years > 10) milestones.push("Year 5: Establish emergency fund");
	if (years > 15) milestones.push("Year 10: Max out tax-advantaged accounts");
	if (years > 20) milestones.push("Year 15: Consider Coast FIRE");
	milestones.push(`Year ${years}: Target retirement age`);

	return { years, milestones };
}


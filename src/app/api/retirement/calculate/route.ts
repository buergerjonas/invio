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
				{ error: "Upgrade to Pro or Plus to use Retirement Planner" },
				{ status: 403 }
			);
		}

		const { plan_type, inputs } = await request.json();

		const results = calculateRetirementPlan(plan_type, inputs);

		// Save to database
		const db = getDB();
		const planId = crypto.randomUUID();
		await db
			.prepare(
				"INSERT INTO retirement_plans (id, user_id, plan_type, inputs_data, projections_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
			)
			.bind(
				planId,
				user.id,
				plan_type,
				JSON.stringify(inputs),
				JSON.stringify(results),
				Date.now(),
				Date.now()
			)
			.run();

		return NextResponse.json({ id: planId, ...results });
	} catch (error) {
		console.error("Retirement calculation error:", error);
		return NextResponse.json(
			{ error: "Failed to calculate retirement plan" },
			{ status: 500 }
		);
	}
}

function calculateRetirementPlan(planType: string, inputs: any) {
	const {
		currentAge,
		retirementAge,
		currentSavings,
		annualIncome,
		annualExpenses,
		savingsRate,
		expectedReturn = 7,
		inflationRate = 3,
	} = inputs;

	const yearsToRetirement = retirementAge - currentAge;
	const realReturn = (expectedReturn - inflationRate) / 100;
	const monthlyReturn = realReturn / 12;

	// Calculate annual savings
	const annualSavings = (annualIncome * savingsRate) / 100;
	const monthlySavings = annualSavings / 12;

	// Future value of current savings
	const futureValueCurrent = currentSavings * Math.pow(1 + realReturn, yearsToRetirement);

	// Future value of monthly contributions (annuity)
	const futureValueContributions =
		monthlySavings *
		((Math.pow(1 + monthlyReturn, yearsToRetirement * 12) - 1) / monthlyReturn);

	const projectedSavings = futureValueCurrent + futureValueContributions;

	// Calculate target amount needed (25x annual expenses for FIRE, or traditional 4% rule)
	let targetAmount;
	if (planType === "fire" || planType === "barista_fire") {
		targetAmount = annualExpenses * 25; // 4% withdrawal rate
	} else if (planType === "coast_fire") {
		// Coast FIRE: enough saved that it will grow to target without more contributions
		const yearsToTraditionalRetirement = 65 - currentAge;
		targetAmount = annualExpenses * 25;
		const coastAmount = targetAmount / Math.pow(1 + realReturn, yearsToTraditionalRetirement);
		return {
			yearsToRetirement,
			targetAmount: Math.round(targetAmount),
			projectedSavings: Math.round(projectedSavings),
			monthlySavings: Math.round(monthlySavings),
			coastFireAge: currentAge + yearsToRetirement,
			coastFireAmount: Math.round(coastAmount),
			milestones: generateMilestones(yearsToRetirement, currentAge),
		};
	} else {
		// Traditional retirement
		targetAmount = annualExpenses * 25; // Simplified
	}

	// Calculate required monthly savings if not on track
	let requiredMonthlySavings = monthlySavings;
	if (projectedSavings < targetAmount) {
		const needed = targetAmount - futureValueCurrent;
		requiredMonthlySavings =
			needed / ((Math.pow(1 + monthlyReturn, yearsToRetirement * 12) - 1) / monthlyReturn);
	}

	return {
		yearsToRetirement,
		targetAmount: Math.round(targetAmount),
		projectedSavings: Math.round(projectedSavings),
		monthlySavings: Math.round(monthlySavings),
		requiredMonthlySavings: Math.round(requiredMonthlySavings),
		onTrack: projectedSavings >= targetAmount,
		milestones: generateMilestones(yearsToRetirement, currentAge),
	};
}

function generateMilestones(yearsToRetirement: number, currentAge: number): string[] {
	const milestones = [];
	const milestonesAges = [5, 10, 15, 20, 25];

	for (const milestoneYears of milestonesAges) {
		if (milestoneYears <= yearsToRetirement) {
			milestones.push(`Age ${currentAge + milestoneYears}: ${milestoneYears} years to retirement`);
		}
	}

	return milestones;
}


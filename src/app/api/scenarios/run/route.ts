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
				{ error: "Upgrade to Pro or Plus to use Scenario Engine" },
				{ status: 403 }
			);
		}

		const { scenario_type, inputs } = await request.json();

		const results = runScenario(scenario_type, inputs);

		// Save scenario to database
		const db = getDB();
		const scenarioId = crypto.randomUUID();
		await db
			.prepare(
				"INSERT INTO scenarios (id, user_id, name, scenario_type, inputs_data, results_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
			)
			.bind(
				scenarioId,
				user.id,
				`${scenario_type} scenario`,
				scenario_type,
				JSON.stringify(inputs),
				JSON.stringify(results),
				Date.now()
			)
			.run();

		return NextResponse.json({ id: scenarioId, ...results });
	} catch (error) {
		console.error("Scenario error:", error);
		return NextResponse.json(
			{ error: "Failed to run scenario" },
			{ status: 500 }
		);
	}
}

function runScenario(scenarioType: string, inputs: any): any {
	switch (scenarioType) {
		case "house_purchase":
			return runHousePurchaseScenario(inputs);
		case "market_crash":
			return runMarketCrashScenario(inputs);
		case "sabbatical":
			return runSabbaticalScenario(inputs);
		case "savings_change":
			return runSavingsChangeScenario(inputs);
		default:
			return { error: "Unknown scenario type" };
	}
}

function runHousePurchaseScenario(inputs: any) {
	const { currentSavings, housePrice, downPayment, monthlySavings } = inputs;
	const remainingSavings = currentSavings - downPayment;
	const monthlyMortgage = (housePrice - downPayment) * 0.004; // Simplified
	const newMonthlySavings = monthlySavings - monthlyMortgage;

	return {
		impact: `Savings reduced by $${downPayment.toLocaleString()}, monthly savings drop to $${Math.max(0, Math.round(newMonthlySavings)).toLocaleString()}`,
		before: {
			savings: currentSavings,
			monthlySavings: monthlySavings,
		},
		after: {
			savings: remainingSavings,
			monthlySavings: Math.max(0, Math.round(newMonthlySavings)),
			monthlyMortgage: Math.round(monthlyMortgage),
		},
		recommendations: [
			"Ensure you maintain 3-6 months of expenses as emergency fund after down payment",
			"Consider impact on retirement savings goals",
			"Factor in property taxes, insurance, and maintenance costs",
		],
	};
}

function runMarketCrashScenario(inputs: any) {
	const { currentSavings, marketCrashPercent, monthlySavings } = inputs;
	const crashMultiplier = 1 - marketCrashPercent / 100;
	const newSavings = currentSavings * crashMultiplier;
	const recoveryYears = Math.log(1 / crashMultiplier) / Math.log(1.07); // Assuming 7% recovery

	return {
		impact: `Portfolio value drops to $${Math.round(newSavings).toLocaleString()}, estimated ${Math.round(recoveryYears)} years to recover`,
		before: {
			portfolioValue: currentSavings,
			monthlySavings: monthlySavings,
		},
		after: {
			portfolioValue: Math.round(newSavings),
			monthlySavings: monthlySavings,
			recoveryYears: Math.round(recoveryYears),
		},
		recommendations: [
			"Stay the course - market crashes are temporary",
			"Consider this a buying opportunity if you have cash",
			"Don't panic sell - time in market beats timing the market",
		],
	};
}

function runSabbaticalScenario(inputs: any) {
	const { currentSavings, annualIncome, annualExpenses, sabbaticalMonths, monthlySavings } =
		inputs;
	const monthsOfExpenses = currentSavings / (annualExpenses / 12);
	const sabbaticalExpenses = (annualExpenses / 12) * sabbaticalMonths;
	const newSavings = currentSavings - sabbaticalExpenses;
	const yearsToRecover = sabbaticalExpenses / (monthlySavings * 12);

	return {
		impact: `Savings drop by $${Math.round(sabbaticalExpenses).toLocaleString()}, ${Math.round(yearsToRecover)} years to recover savings`,
		before: {
			savings: currentSavings,
			monthlySavings: monthlySavings,
		},
		after: {
			savings: Math.round(newSavings),
			monthlySavings: monthlySavings,
			sabbaticalExpenses: Math.round(sabbaticalExpenses),
		},
		recommendations: [
			`You have ${Math.round(monthsOfExpenses)} months of expenses saved`,
			sabbaticalMonths <= monthsOfExpenses
				? "You have enough savings for this sabbatical"
				: "Consider reducing sabbatical length or increasing savings first",
			"Plan for reduced income during sabbatical",
		],
	};
}

function runSavingsChangeScenario(inputs: any) {
	const { currentSavings, monthlySavings, savingsChangePercent } = inputs;
	const newMonthlySavings = monthlySavings * (1 + savingsChangePercent / 100);
	const annualDifference = (newMonthlySavings - monthlySavings) * 12;
	const yearsToImpact = Math.abs(annualDifference) > 0 ? 5 : 0;
	const projectedDifference = annualDifference * yearsToImpact;

	return {
		impact: `Monthly savings ${savingsChangePercent > 0 ? "increase" : "decrease"} by $${Math.abs(Math.round(newMonthlySavings - monthlySavings)).toLocaleString()}, ${Math.abs(Math.round(projectedDifference)).toLocaleString()} difference over ${yearsToImpact} years`,
		before: {
			monthlySavings: monthlySavings,
			annualSavings: monthlySavings * 12,
		},
		after: {
			monthlySavings: Math.round(newMonthlySavings),
			annualSavings: Math.round(newMonthlySavings * 12),
			projectedDifference: Math.round(projectedDifference),
		},
		recommendations: [
			savingsChangePercent > 0
				? "Great! Increasing savings accelerates your path to financial independence"
				: "Consider ways to reduce expenses or increase income to maintain savings rate",
			"Automate the new savings amount to stay consistent",
		],
	};
}


import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier } from "@/lib/subscriptions";
import { optimizeAssetLocation, saveTaxOptimization } from "@/lib/tax-optimizer";

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tier = await getUserTier(user.id);
		if (tier !== "plus" && tier !== "lifetime") {
			return NextResponse.json(
				{ error: "Upgrade to Plus or Lifetime to use Tax Optimizer" },
				{ status: 403 }
			);
		}

		const { holdings } = await request.json();

		if (!holdings) {
			return NextResponse.json(
				{ error: "Holdings data is required" },
				{ status: 400 }
			);
		}

		const optimizations = optimizeAssetLocation(holdings);

		// Save optimization
		await saveTaxOptimization(user.id, holdings, optimizations);

		return NextResponse.json({ optimizations });
	} catch (error) {
		console.error("Tax optimization error:", error);
		return NextResponse.json(
			{ error: "Failed to optimize asset location" },
			{ status: 500 }
		);
	}
}


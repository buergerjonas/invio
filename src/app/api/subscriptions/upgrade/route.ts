import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier, createSubscription } from "@/lib/subscriptions";
import { getDB } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { tier, payment_method } = await request.json();

		if (!["pro", "plus", "lifetime"].includes(tier)) {
			return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
		}

		const currentTier = await getUserTier(user.id);

		// Check if already on this tier or higher
		const tierOrder = { free: 0, pro: 1, plus: 2, lifetime: 3 };
		if (tierOrder[tier as keyof typeof tierOrder] <= tierOrder[currentTier as keyof typeof tierOrder]) {
			return NextResponse.json(
				{ error: "You are already on this tier or higher" },
				{ status: 400 }
			);
		}

		// In production, process payment here with Stripe/Paddle
		// For now, we'll create the subscription directly
		if (payment_method === "manual" || process.env.NODE_ENV === "development") {
			const durationMonths = tier === "lifetime" ? undefined : 1;
			const subscription = await createSubscription(user.id, tier as any, durationMonths);

			return NextResponse.json({
				success: true,
				subscription,
				message: "Subscription upgraded successfully",
			});
		}

		// In production, create payment intent/session here
		return NextResponse.json({
			error: "Payment integration required. Use 'manual' for testing.",
		}, { status: 501 });
	} catch (error) {
		console.error("Subscription upgrade error:", error);
		return NextResponse.json(
			{ error: "Failed to upgrade subscription" },
			{ status: 500 }
		);
	}
}


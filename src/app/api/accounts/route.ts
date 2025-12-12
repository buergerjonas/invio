import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier } from "@/lib/subscriptions";
import { getUserAccounts, createAccount } from "@/lib/accounts";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tier = await getUserTier(user.id);
		if (tier === "free") {
			return NextResponse.json(
				{ error: "Upgrade to Pro or Plus to use Account Setup Assistant" },
				{ status: 403 }
			);
		}

		const accounts = await getUserAccounts(user.id);
		return NextResponse.json({ accounts });
	} catch (error) {
		console.error("Error fetching accounts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch accounts" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tier = await getUserTier(user.id);
		if (tier === "free") {
			return NextResponse.json(
				{ error: "Upgrade to Pro or Plus to use Account Setup Assistant" },
				{ status: 403 }
			);
		}

		const { account_type, name, strategy_id } = await request.json();

		if (!account_type || !name) {
			return NextResponse.json(
				{ error: "Account type and name are required" },
				{ status: 400 }
			);
		}

		const account = await createAccount(user.id, account_type, name, strategy_id);
		return NextResponse.json({ account });
	} catch (error) {
		console.error("Error creating account:", error);
		return NextResponse.json(
			{ error: "Failed to create account" },
			{ status: 500 }
		);
	}
}


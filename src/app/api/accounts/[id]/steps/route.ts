import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccountById } from "@/lib/accounts";
import { getAccountSetupSteps } from "@/lib/accounts";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const account = await getAccountById(params.id);
		if (!account || account.user_id !== user.id) {
			return NextResponse.json({ error: "Account not found" }, { status: 404 });
		}

		const steps = await getAccountSetupSteps(params.id);
		return NextResponse.json({ steps });
	} catch (error) {
		console.error("Error fetching steps:", error);
		return NextResponse.json(
			{ error: "Failed to fetch steps" },
			{ status: 500 }
		);
	}
}


import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccountById, getSetupStepById, updateStepStatus } from "@/lib/accounts";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { status } = await request.json();

		if (!["pending", "in_progress", "completed", "skipped"].includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}

		// Verify the step belongs to a user's account
		const step = await getSetupStepById(params.id);
		if (!step) {
			return NextResponse.json({ error: "Step not found" }, { status: 404 });
		}

		const account = await getAccountById(step.account_id);
		if (!account || account.user_id !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		await updateStepStatus(params.id, status as any);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating step:", error);
		return NextResponse.json(
			{ error: "Failed to update step" },
			{ status: 500 }
		);
	}
}


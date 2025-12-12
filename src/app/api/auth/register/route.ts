import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { createSubscription } from "@/lib/subscriptions";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters" },
				{ status: 400 }
			);
		}

		const user = await createUser(email, password, name);

		// Create free subscription for new user
		await createSubscription(user.id, "free");

		// Create session cookie
		const cookieStore = await cookies();
		cookieStore.set("invio_session", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		});

		return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
	} catch (error: any) {
		console.error("Registration error:", error);
		
		if (error.message?.includes("UNIQUE constraint")) {
			return NextResponse.json(
				{ error: "An account with this email already exists" },
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ error: "An error occurred during registration" },
			{ status: 500 }
		);
	}
}


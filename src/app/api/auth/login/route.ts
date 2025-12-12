import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		const user = await authenticateUser(email, password);

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Create session cookie
		const cookieStore = await cookies();
		cookieStore.set("invio_session", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		});

		return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "An error occurred during login" },
			{ status: 500 }
		);
	}
}


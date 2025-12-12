import { getDB } from "./db";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "invio_session";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface User {
	id: string;
	email: string;
	name: string | null;
	created_at: number;
}

export interface Session {
	userId: string;
	expiresAt: number;
}

// Password hashing using Web Crypto API (available in Cloudflare Workers)
async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const passwordHash = await hashPassword(password);
	return passwordHash === hash;
}

function generateId(): string {
	return crypto.randomUUID();
}

export async function createUser(
	email: string,
	password: string,
	name?: string
): Promise<User> {
	const db = getDB();
	const userId = generateId();
	const passwordHash = await hashPassword(password);
	const now = Date.now();

	await db
		.prepare(
			"INSERT INTO users (id, email, password_hash, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
		)
		.bind(userId, email, passwordHash, name || null, now, now)
		.run();

	return {
		id: userId,
		email,
		name: name || null,
		created_at: now,
	};
}

export async function authenticateUser(
	email: string,
	password: string
): Promise<User | null> {
	const db = getDB();
	const user = await db
		.prepare("SELECT id, email, password_hash, name, created_at FROM users WHERE email = ?")
		.bind(email)
		.first<{
			id: string;
			email: string;
			password_hash: string;
			name: string | null;
			created_at: number;
		}>();

	if (!user) {
		return null;
	}

	const isValid = await verifyPassword(password, user.password_hash);
	if (!isValid) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		created_at: user.created_at,
	};
}

export async function createSession(userId: string): Promise<string> {
	const sessionId = generateId();
	const expiresAt = Date.now() + SESSION_DURATION;

	// In a real implementation, you'd store sessions in a sessions table
	// For now, we'll use a simple cookie-based approach
	return sessionId;
}

export async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

	if (!sessionCookie) {
		return null;
	}

	// For now, we store the user ID directly in the cookie
	// In production, you'd want to use a sessions table with proper validation
	const userId = sessionCookie.value;
	return getUserById(userId);
}

export async function getUserById(userId: string): Promise<User | null> {
	const db = getDB();
	const user = await db
		.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?")
		.bind(userId)
		.first<{
			id: string;
			email: string;
			name: string | null;
			created_at: number;
		}>();

	if (!user) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		created_at: user.created_at,
	};
}


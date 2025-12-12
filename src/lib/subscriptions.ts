import { getDB } from "./db";

function generateId(): string {
	return crypto.randomUUID();
}

export type SubscriptionTier = "free" | "pro" | "plus" | "lifetime";
export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface Subscription {
	id: string;
	user_id: string;
	tier: SubscriptionTier;
	status: SubscriptionStatus;
	starts_at: number;
	ends_at: number | null;
	created_at: number;
}

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
	free: [
		"Basic calculators",
		"Light strategy preview",
		"Limited access",
	],
	pro: [
		"Full investment strategy plan",
		"Account setup assistant",
		"PRO calculators",
		"Step-by-step optimization",
	],
	plus: [
		"Everything in Pro",
		"Portfolio tracker",
		"AI Portfolio Advisor",
		"Tax optimizer",
		"Personalized alerts",
		"PDF reports",
	],
	lifetime: [
		"Everything in Plus",
		"Lifetime access",
		"All future features",
	],
};

export function getTierFeatures(tier: SubscriptionTier): string[] {
	return TIER_FEATURES[tier] || TIER_FEATURES.free;
}

export async function getUserSubscription(
	userId: string
): Promise<Subscription | null> {
	const db = getDB();
	const subscription = await db
		.prepare(
			"SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
		)
		.bind(userId)
		.first<Subscription>();

	return subscription || null;
}

export async function getUserTier(userId: string): Promise<SubscriptionTier> {
	const subscription = await getUserSubscription(userId);
	return subscription?.tier || "free";
}

export function hasFeatureAccess(
	tier: SubscriptionTier,
	feature: string
): boolean {
	const features = getTierFeatures(tier);
	return features.includes(feature);
}

export async function createSubscription(
	userId: string,
	tier: SubscriptionTier,
	durationMonths?: number
): Promise<Subscription> {
	const db = getDB();
	const subscriptionId = generateId();
	const now = Date.now();
	const endsAt =
		tier === "lifetime"
			? null
			: durationMonths
				? now + durationMonths * 30 * 24 * 60 * 60 * 1000
				: null;

	await db
		.prepare(
			"INSERT INTO subscriptions (id, user_id, tier, status, starts_at, ends_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
		)
		.bind(subscriptionId, userId, tier, "active", now, endsAt, now)
		.run();

	return {
		id: subscriptionId,
		user_id: userId,
		tier,
		status: "active",
		starts_at: now,
		ends_at: endsAt,
		created_at: now,
	};
}


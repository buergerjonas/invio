import { getCurrentUser } from "@/lib/auth";
import { getUserSubscription, getTierFeatures } from "@/lib/subscriptions";
import UpgradeButton from "./upgrade-button";

export default async function BillingPage() {
	const user = await getCurrentUser();
	const subscription = user ? await getUserSubscription(user.id) : null;
	const tier = subscription?.tier || "free";
	const features = getTierFeatures(tier);

	const plans = [
		{
			name: "Free",
			price: 0,
			period: "",
			features: getTierFeatures("free"),
			current: tier === "free",
		},
		{
			name: "Pro",
			price: 10,
			period: "/month",
			features: getTierFeatures("pro"),
			current: tier === "pro",
		},
		{
			name: "Plus",
			price: 20,
			period: "/month",
			features: getTierFeatures("plus"),
			current: tier === "plus",
		},
		{
			name: "Lifetime",
			price: 200,
			period: " one-time",
			features: getTierFeatures("lifetime"),
			current: tier === "lifetime",
		},
	];

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Billing & Subscription
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Manage your subscription and upgrade your plan
				</p>
			</div>

			{/* Current Plan */}
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
					Current Plan
				</h2>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-2xl font-bold capitalize text-slate-900 dark:text-slate-100">
							{tier}
						</p>
						{subscription && (
							<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
								{subscription.ends_at
									? `Renews on ${new Date(subscription.ends_at).toLocaleDateString()}`
									: "Active"}
							</p>
						)}
					</div>
					<div>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{features.length} features active
						</p>
					</div>
				</div>
			</div>

			{/* Available Plans */}
			<div>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
					Available Plans
				</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`border-2 rounded-xl p-6 ${
								plan.current
									? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
									: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
							}`}
						>
							{plan.current && (
								<div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
									CURRENT PLAN
								</div>
							)}
							<h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
								{plan.name}
							</h3>
							<div className="mb-4">
								<span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
									${plan.price}
								</span>
								<span className="text-slate-600 dark:text-slate-400">
									{plan.period}
								</span>
							</div>
							<ul className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
								{plan.features.slice(0, 4).map((feature, i) => (
									<li key={i}>✓ {feature}</li>
								))}
								{plan.features.length > 4 && (
									<li className="text-emerald-600 dark:text-emerald-400">
										+{plan.features.length - 4} more
									</li>
								))}
							</ul>
							{!plan.current && (
								<UpgradeButton
									currentTier={tier}
									targetTier={plan.name.toLowerCase()}
									price={plan.price}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
				<p className="text-sm text-slate-600 dark:text-slate-400">
					💡 Payment integration coming soon. For now, upgrades use manual mode for testing.
					In production, integrate Stripe or Paddle for secure payments.
				</p>
			</div>
		</div>
	);
}

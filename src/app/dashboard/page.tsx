import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier, getTierFeatures } from "@/lib/subscriptions";

export default async function DashboardPage() {
	const user = await getCurrentUser();
	const tier = user ? await getUserTier(user.id) : "free";
	const features = getTierFeatures(tier);

	const quickActions = [
		{
			title: "Design Investment Strategy",
			description: "Create a personalized investment plan tailored to your goals",
			href: "/dashboard/strategy",
			icon: "🎯",
			available: tier !== "free",
		},
		{
			title: "Account Setup Assistant",
			description: "Get step-by-step guidance on opening and funding accounts",
			href: "/dashboard/accounts",
			icon: "🏦",
			available: tier !== "free",
		},
		{
			title: "Retirement Planner",
			description: "Plan your path to FIRE, Coast FIRE, or traditional retirement",
			href: "/dashboard/retirement",
			icon: "🏖️",
			available: tier !== "free",
		},
		{
			title: "Portfolio Tracker",
			description: "Track your investments and see allocation vs targets",
			href: "/dashboard/portfolio",
			icon: "📈",
			available: tier === "plus" || tier === "lifetime",
		},
		{
			title: "Tax Optimizer",
			description: "Optimize asset location to minimize taxes",
			href: "/dashboard/tax",
			icon: "💰",
			available: tier === "plus" || tier === "lifetime",
		},
		{
			title: "AI Portfolio Assistant",
			description: "Get AI-powered explanations and optimization suggestions",
			href: "/dashboard/ai",
			icon: "🤖",
			available: tier === "plus" || tier === "lifetime",
		},
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Welcome back{user?.name ? `, ${user.name}` : ""}!
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Your personal finance automation platform
				</p>
			</div>

			{/* Subscription Status */}
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
							Current Plan: <span className="capitalize">{tier}</span>
						</h2>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{features.length} features available
						</p>
					</div>
					{tier !== "lifetime" && (
						<Link
							href="/dashboard/settings/billing"
							className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors text-sm font-medium"
						>
							Upgrade Plan
						</Link>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
					Quick Actions
				</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{quickActions.map((action) => (
						<Link
							key={action.title}
							href={action.available ? action.href : "/dashboard/settings/billing"}
							className={`block p-6 rounded-xl border-2 transition-all ${
								action.available
									? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg"
									: "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60"
							}`}
						>
							<div className="flex items-start gap-4">
								<span className="text-3xl">{action.icon}</span>
								<div className="flex-1">
									<h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
										{action.title}
									</h3>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										{action.description}
									</p>
									{!action.available && (
										<span className="inline-block mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
											Upgrade to unlock →
										</span>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Getting Started */}
			{tier === "free" && (
				<div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-8 text-white">
					<h2 className="text-2xl font-bold mb-2">Ready to level up?</h2>
					<p className="mb-6 opacity-90">
						Unlock the full power of Invio with Pro or Plus plans. Get personalized investment strategies, account setup assistance, and advanced planning tools.
					</p>
					<Link
						href="/dashboard/settings/billing"
						className="inline-block px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
					>
						View Plans
					</Link>
				</div>
			)}
		</div>
	);
}


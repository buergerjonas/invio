import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier } from "@/lib/subscriptions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();
	
	if (!user) {
		redirect("/login");
	}

	const tier = await getUserTier(user.id);

	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: "📊" },
		{ name: "Strategy Designer", href: "/dashboard/strategy", icon: "🎯" },
		{ name: "Account Setup", href: "/dashboard/accounts", icon: "🏦" },
		{ name: "Retirement Planner", href: "/dashboard/retirement", icon: "🏖️" },
		{ name: "Portfolio Tracker", href: "/dashboard/portfolio", icon: "📈" },
		{ name: "Tax Optimizer", href: "/dashboard/tax", icon: "💰" },
		{ name: "AI Assistant", href: "/dashboard/ai", icon: "🤖" },
		{ name: "Scenarios", href: "/dashboard/scenarios", icon: "🔮" },
	];

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			{/* Sidebar */}
			<div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-6 border-b border-slate-200 dark:border-slate-800">
						<Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
							Invio
						</Link>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
							Personal Finance Automation
						</p>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							>
								<span className="text-xl">{item.icon}</span>
								<span className="text-sm font-medium">{item.name}</span>
							</Link>
						))}
					</nav>

					{/* User info */}
					<div className="p-4 border-t border-slate-200 dark:border-slate-800">
						<div className="flex items-center justify-between mb-2">
							<div>
								<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
									{user.name || user.email}
								</p>
								<p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
									{tier} Plan
								</p>
							</div>
						</div>
						<Link
							href="/dashboard/settings"
							className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
						>
							Settings
						</Link>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="pl-64">
				<main className="p-8">{children}</main>
			</div>
		</div>
	);
}


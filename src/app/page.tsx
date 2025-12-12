import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
			{/* Navigation */}
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex items-center justify-between">
					<div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
						Invio
					</div>
					<div className="flex gap-4">
						<Link
							href="/login"
							className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
						>
							Sign In
						</Link>
						<Link
							href="/register"
							className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
						>
							Get Started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
				<div className="max-w-6xl mx-auto text-center mb-16">
					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
						Your Personal Finance Automation Platform
					</h1>
					<p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
						Design investment strategies, automate account setup, optimize taxes, and plan your path to financial independence—all in one place.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/register"
							className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
						>
							Start Free Trial
						</Link>
						<Link
							href="#features"
							className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
						>
							Learn More
						</Link>
					</div>
				</div>

				{/* Features Grid */}
				<div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">🎯</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							Investment Strategy Designer
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Get a personalized investment plan with account priorities, asset allocation, and contribution strategy.
						</p>
					</div>

					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">🏦</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							Account Setup Assistant
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Step-by-step guidance to open, fund, and automate your investment accounts.
						</p>
					</div>

					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">💰</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							Tax Optimizer
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Optimize asset location to minimize taxes and maximize after-tax returns.
						</p>
					</div>

					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">🏖️</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							Retirement Planner
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Plan your path to FIRE, Coast FIRE, or traditional retirement with detailed projections.
						</p>
					</div>

					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">🤖</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							AI Portfolio Assistant
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Get AI-powered explanations of your portfolio and personalized optimization suggestions.
						</p>
					</div>

					<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
						<div className="text-4xl mb-4">🔮</div>
						<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
							Scenario Engine
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Test "what if" scenarios like market crashes, major purchases, or career changes.
						</p>
					</div>
				</div>

				{/* Pricing */}
				<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 mb-20">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
						Simple, Transparent Pricing
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6">
							<h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Free</h3>
							<p className="text-3xl font-bold mb-4 text-emerald-600">$0</p>
							<ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400">
								<li>✓ Basic calculators</li>
								<li>✓ Light strategy preview</li>
								<li>✓ Limited access</li>
							</ul>
							<Link
								href="/register"
								className="block w-full text-center px-4 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
							>
								Get Started
							</Link>
						</div>

						<div className="border-2 border-emerald-500 rounded-xl p-6 relative">
							<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
								Most Popular
							</div>
							<h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Pro</h3>
							<p className="text-3xl font-bold mb-4 text-emerald-600">$10<span className="text-lg">/mo</span></p>
							<ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400">
								<li>✓ Full investment strategy</li>
								<li>✓ Account setup assistant</li>
								<li>✓ PRO calculators</li>
								<li>✓ Step-by-step optimization</li>
							</ul>
							<Link
								href="/register"
								className="block w-full text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
							>
								Start Pro Trial
							</Link>
						</div>

						<div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6">
							<h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Plus</h3>
							<p className="text-3xl font-bold mb-4 text-emerald-600">$20<span className="text-lg">/mo</span></p>
							<ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400">
								<li>✓ Everything in Pro</li>
								<li>✓ Portfolio tracker</li>
								<li>✓ AI Portfolio Advisor</li>
								<li>✓ Tax optimizer</li>
								<li>✓ Personalized alerts</li>
								<li>✓ PDF reports</li>
							</ul>
							<Link
								href="/register"
								className="block w-full text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
							>
								Start Plus Trial
							</Link>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="text-center py-16 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
						Ready to Transform Your Finances?
					</h2>
					<p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
						Join thousands of users building wealth and securing their financial future with Invio.
					</p>
					<Link
						href="/register"
						className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						Get Started Free
					</Link>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-slate-600 dark:text-slate-400 text-sm">
							© {new Date().getFullYear()} Invio. All rights reserved.
						</p>
						<div className="flex gap-6">
							<Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Privacy
							</Link>
							<Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Terms
							</Link>
							<Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Contact
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

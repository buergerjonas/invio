export default function PortfolioTrackerPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Portfolio Tracker
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Track your investments and see allocation vs targets
				</p>
			</div>

			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📈</div>
					<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
						Plus Feature
					</h2>
					<p className="text-slate-600 dark:text-slate-400 mb-6">
						Portfolio tracking is available with Plus or Lifetime plans. Features include:
					</p>
					<ul className="text-left max-w-md mx-auto space-y-2 text-slate-600 dark:text-slate-400">
						<li>• Connect accounts via Plaid/Truelayer</li>
						<li>• View all accounts in one place</li>
						<li>• Compare allocation vs targets</li>
						<li>• Rebalancing alerts</li>
						<li>• Contribution tracking</li>
					</ul>
				</div>
			</div>
		</div>
	);
}


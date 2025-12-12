export default function SettingsPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					Settings
				</h1>
			</div>

			<div className="space-y-6">
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Account Settings
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						Account settings coming soon...
					</p>
				</div>

				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Billing & Subscription
					</h2>
					<p className="text-slate-600 dark:text-slate-400 mb-4">
						Manage your subscription and billing information.
					</p>
					<a
						href="/dashboard/settings/billing"
						className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
					>
						Manage Billing
					</a>
				</div>
			</div>
		</div>
	);
}


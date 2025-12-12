"use client";

import { useState } from "react";

export default function UpgradeButton({
	currentTier,
	targetTier,
	price,
}: {
	currentTier: string;
	targetTier: string;
	price: number;
}) {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleUpgrade = async () => {
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/subscriptions/upgrade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tier: targetTier,
					payment_method: "manual", // For testing - replace with actual payment in production
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage("Upgrade successful! Refreshing...");
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				setMessage(data.error || "Upgrade failed");
			}
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				onClick={handleUpgrade}
				disabled={loading}
				className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
			>
				{loading
					? "Processing..."
					: `Upgrade to ${targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}`}
			</button>
			{message && (
				<p
					className={`text-xs mt-2 text-center ${
						message.includes("successful")
							? "text-emerald-600 dark:text-emerald-400"
							: "text-red-600 dark:text-red-400"
					}`}
				>
					{message}
				</p>
			)}
		</div>
	);
}


import Image from "next/image";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
			{/* Hero Section */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
				<div className="max-w-6xl mx-auto">
					{/* Main Content Grid */}
					<div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
						{/* Left Column - Book Cover & Info */}
						<div className="flex flex-col items-center lg:items-start">
							{/* Book Cover Placeholder */}
							<div className="w-64 sm:w-80 mb-8 shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
								<div className="aspect-[2/3] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center relative">
									<div className="absolute inset-0 bg-black/10"></div>
									<div className="relative z-10 text-center p-6 text-white">
										<h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">Catching Up on</h2>
										<h2 className="text-3xl sm:text-4xl font-bold">Investing</h2>
									</div>
								</div>
							</div>
							
							{/* Book Title */}
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center lg:text-left bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
								Catching Up on Investing
							</h1>
							
							{/* Author */}
							<p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-6 text-center lg:text-left">
								Your Guide to Building Wealth
							</p>
							
							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
								<a
									href="#buy"
									className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center transform hover:scale-105"
								>
									Buy Now
								</a>
								<a
									href="#about"
									className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-center"
								>
									Learn More
								</a>
							</div>
						</div>

						{/* Right Column - Description */}
						<div className="space-y-6">
							<h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
								Start Your Investment Journey Today
							</h2>
							<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
								Whether you're just starting out or feel like you're behind, <strong className="text-emerald-600 dark:text-emerald-400">Catching Up on Investing</strong> provides a clear, actionable roadmap to building wealth and securing your financial future.
							</p>
							<p className="text-base sm:text-lg text-slate-500 dark:text-slate-500 leading-relaxed">
								Learn the fundamentals of investing, understand different asset classes, and develop a strategy that works for your goals and timeline. No jargon, no fluff—just practical advice you can implement immediately.
							</p>
						</div>
					</div>

					{/* Features/Highlights Section */}
					<div id="about" className="mt-20 mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
							What You'll Learn
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
								<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Investment Fundamentals</h3>
								<p className="text-slate-600 dark:text-slate-400">
									Master the basics of stocks, bonds, ETFs, and other investment vehicles. Understand how markets work and how to make informed decisions.
								</p>
							</div>
							
							<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
								<div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Portfolio Building</h3>
								<p className="text-slate-600 dark:text-slate-400">
									Learn how to create a diversified portfolio that matches your risk tolerance and financial goals. Get step-by-step guidance on asset allocation.
								</p>
							</div>
							
							<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
								<div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Long-Term Strategy</h3>
								<p className="text-slate-600 dark:text-slate-400">
									Develop a sustainable investment strategy that grows your wealth over time. Learn how to stay the course and avoid common pitfalls.
								</p>
							</div>
						</div>
					</div>

					{/* Testimonials/Reviews Section */}
					<div className="mt-20 mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
							What Readers Are Saying
						</h2>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400">
										{"★★★★★".split("").map((star, i) => (
											<span key={i}>{star}</span>
										))}
									</div>
								</div>
								<p className="text-slate-600 dark:text-slate-400 italic mb-4">
									"Finally, an investment book that doesn't talk down to beginners. This book gave me the confidence to start investing and I've already seen great results!"
								</p>
								<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">— Sarah M.</p>
							</div>
							
							<div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400">
										{"★★★★★".split("").map((star, i) => (
											<span key={i}>{star}</span>
										))}
									</div>
								</div>
								<p className="text-slate-600 dark:text-slate-400 italic mb-4">
									"I wish I had this book 10 years ago. The practical advice and clear explanations helped me understand investing in a way that finally clicked."
								</p>
								<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">— Michael R.</p>
							</div>
						</div>
					</div>

					{/* Final CTA Section */}
					<div id="buy" className="mt-20 text-center py-16 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl">
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
							Ready to Build Your Wealth?
						</h2>
						<p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
							Get your copy today and take the first step toward financial independence. Join thousands of readers who are already on their investment journey.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="#"
								className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
							>
								Buy on Amazon
							</a>
							<a
								href="#"
								className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
							>
								Buy on Bookstore
							</a>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-slate-600 dark:text-slate-400 text-sm">
							© {new Date().getFullYear()} Catching Up on Investing. All rights reserved.
						</p>
						<div className="flex gap-6">
							<a href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Twitter
							</a>
							<a href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Instagram
							</a>
							<a href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
								Contact
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

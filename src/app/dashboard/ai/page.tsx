"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export default function AIPortfolioPage() {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "assistant",
			content:
				"Hi! I'm your AI Portfolio Assistant. I can help you understand your portfolio, suggest optimizations, and answer questions about your investments. What would you like to know?",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || loading) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: input,
					conversation_type: "portfolio_explanation",
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: data.response },
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: "Sorry, I encountered an error. Please try again.",
					},
				]);
			}
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const quickQuestions = [
		"Explain my portfolio allocation",
		"What should I optimize?",
		"Am I diversified enough?",
		"What are my biggest risks?",
	];

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
					AI Portfolio Assistant
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Get AI-powered explanations and optimization suggestions
				</p>
			</div>

			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col h-[600px]">
				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4">
					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[80%] rounded-lg p-4 ${
									message.role === "user"
										? "bg-emerald-600 text-white"
										: "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
								}`}
							>
								<div className="whitespace-pre-wrap">{message.content}</div>
							</div>
						</div>
					))}
					{loading && (
						<div className="flex justify-start">
							<div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
								<div className="flex gap-2">
									<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
									<div
										className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.2s" }}
									></div>
									<div
										className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.4s" }}
									></div>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Quick Questions */}
				{messages.length === 1 && (
					<div className="px-6 pb-4">
						<div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
							Quick questions:
						</div>
						<div className="flex flex-wrap gap-2">
							{quickQuestions.map((question, index) => (
								<button
									key={index}
									onClick={() => setInput(question)}
									className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
								>
									{question}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Input */}
				<form onSubmit={handleSend} className="border-t border-slate-200 dark:border-slate-700 p-4">
					<div className="flex gap-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask me anything about your portfolio..."
							className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading || !input.trim()}
							className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Send
						</button>
					</div>
				</form>
			</div>

			<div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
				<div className="text-sm text-blue-800 dark:text-blue-200">
					💡 <strong>Note:</strong> This AI assistant provides general guidance. Always consult
					with a financial advisor for personalized advice.
				</div>
			</div>
		</div>
	);
}

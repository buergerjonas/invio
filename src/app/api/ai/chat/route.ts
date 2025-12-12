import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTier } from "@/lib/subscriptions";
import { getDB } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tier = await getUserTier(user.id);
		if (tier !== "plus" && tier !== "lifetime") {
			return NextResponse.json(
				{ error: "Upgrade to Plus or Lifetime to use AI Portfolio Assistant" },
				{ status: 403 }
			);
		}

		const { message, conversation_type } = await request.json();

		if (!message) {
			return NextResponse.json({ error: "Message is required" }, { status: 400 });
		}

		// Generate AI response (simplified - in production, use Cloudflare AI or OpenAI)
		const response = generateAIResponse(message, conversation_type);

		// Save conversation to database
		const db = getDB();
		const conversationId = crypto.randomUUID();
		
		// Get or create conversation
		const existingConversation = await db
			.prepare(
				"SELECT * FROM ai_conversations WHERE user_id = ? AND conversation_type = ? ORDER BY updated_at DESC LIMIT 1"
			)
			.bind(user.id, conversation_type)
			.first<{ id: string; messages: string }>();

		const messages = existingConversation
			? JSON.parse(existingConversation.messages)
			: [];
		
		messages.push(
			{ role: "user", content: message },
			{ role: "assistant", content: response }
		);

		if (existingConversation) {
			await db
				.prepare(
					"UPDATE ai_conversations SET messages = ?, updated_at = ? WHERE id = ?"
				)
				.bind(JSON.stringify(messages), Date.now(), existingConversation.id)
				.run();
		} else {
			await db
				.prepare(
					"INSERT INTO ai_conversations (id, user_id, conversation_type, messages, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
				)
				.bind(
					conversationId,
					user.id,
					conversation_type,
					JSON.stringify(messages),
					Date.now(),
					Date.now()
				)
				.run();
		}

		return NextResponse.json({ response });
	} catch (error) {
		console.error("AI chat error:", error);
		return NextResponse.json(
			{ error: "Failed to process message" },
			{ status: 500 }
		);
	}
}

function generateAIResponse(message: string, conversationType: string): string {
	const lowerMessage = message.toLowerCase();

	// Simple rule-based responses (in production, use actual AI)
	if (lowerMessage.includes("diversif") || lowerMessage.includes("allocation")) {
		return `A well-diversified portfolio typically includes:
- 60-80% stocks (mix of US and international)
- 20-40% bonds (depending on your age and risk tolerance)
- Consider adding REITs or commodities for further diversification

Your specific allocation should match your risk tolerance and time horizon. Would you like me to analyze your current portfolio allocation?`;
	}

	if (lowerMessage.includes("optimize") || lowerMessage.includes("improve")) {
		return `Here are some common portfolio optimizations:
1. **Tax efficiency**: Place tax-inefficient assets (bonds, REITs) in tax-advantaged accounts
2. **Low fees**: Use index funds with expense ratios under 0.20%
3. **Rebalancing**: Rebalance annually to maintain target allocation
4. **Asset location**: Stocks in taxable, bonds in tax-advantaged accounts

I can help you optimize your specific portfolio. Would you like to use the Tax Optimizer tool?`;
	}

	if (lowerMessage.includes("risk")) {
		return `Portfolio risks to consider:
- **Market risk**: Stocks can decline significantly
- **Concentration risk**: Too much in one stock or sector
- **Inflation risk**: Cash loses purchasing power over time
- **Sequence of returns risk**: Poor returns early in retirement

Diversification and a long-term perspective help mitigate these risks. What specific risks are you concerned about?`;
	}

	if (lowerMessage.includes("explain") || lowerMessage.includes("what")) {
		return `I'd be happy to explain! Could you provide more details about what you'd like me to explain? For example:
- Your current portfolio holdings
- A specific investment strategy
- Asset allocation concepts
- Tax implications

The more specific you are, the better I can help!`;
	}

	// Default response
	return `I understand you're asking about: "${message}". 

I can help with:
- Explaining your portfolio allocation
- Suggesting optimizations
- Answering investment questions
- Analyzing risks

Could you provide more details or ask a more specific question?`;
}


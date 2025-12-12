-- Users table
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	email TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	name TEXT,
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'plus', 'lifetime')),
	status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
	starts_at INTEGER NOT NULL,
	ends_at INTEGER,
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Investment strategies table
CREATE TABLE IF NOT EXISTS investment_strategies (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	name TEXT NOT NULL,
	questionnaire_data TEXT NOT NULL, -- JSON string
	strategy_data TEXT NOT NULL, -- JSON string with ladder, allocation, etc.
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Accounts table (401k, IRA, Roth, etc.)
CREATE TABLE IF NOT EXISTS accounts (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	strategy_id TEXT,
	account_type TEXT NOT NULL CHECK (account_type IN ('401k', 'ira', 'roth_ira', 'hsa', 'taxable', '403b', '457', 'other')),
	name TEXT NOT NULL,
	broker TEXT,
	balance REAL DEFAULT 0,
	target_allocation TEXT, -- JSON string
	status TEXT NOT NULL CHECK (status IN ('planned', 'opened', 'funded', 'invested')),
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (strategy_id) REFERENCES investment_strategies(id) ON DELETE SET NULL
);

-- Account setup steps (for Account Setup Assistant)
CREATE TABLE IF NOT EXISTS account_setup_steps (
	id TEXT PRIMARY KEY,
	account_id TEXT NOT NULL,
	step_type TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
	due_date INTEGER,
	completed_at INTEGER,
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Portfolios table (for portfolio tracking)
CREATE TABLE IF NOT EXISTS portfolios (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	name TEXT NOT NULL,
	holdings_data TEXT NOT NULL, -- JSON string with positions
	target_allocation TEXT NOT NULL, -- JSON string
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Retirement plans table
CREATE TABLE IF NOT EXISTS retirement_plans (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	plan_type TEXT NOT NULL CHECK (plan_type IN ('fire', 'coast_fire', 'traditional', 'barista_fire')),
	inputs_data TEXT NOT NULL, -- JSON string with inputs
	projections_data TEXT NOT NULL, -- JSON string with projections
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Scenarios table (for What If Simulator)
CREATE TABLE IF NOT EXISTS scenarios (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	name TEXT NOT NULL,
	scenario_type TEXT NOT NULL CHECK (scenario_type IN ('house_purchase', 'market_crash', 'sabbatical', 'savings_change', 'custom')),
	inputs_data TEXT NOT NULL, -- JSON string
	results_data TEXT NOT NULL, -- JSON string
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tax optimizations table
CREATE TABLE IF NOT EXISTS tax_optimizations (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	portfolio_id TEXT,
	optimization_type TEXT NOT NULL,
	current_data TEXT NOT NULL, -- JSON string
	optimized_data TEXT NOT NULL, -- JSON string
	tax_savings REAL,
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL
);

-- AI conversations table (for AI Portfolio Assistant)
CREATE TABLE IF NOT EXISTS ai_conversations (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	conversation_type TEXT NOT NULL CHECK (conversation_type IN ('portfolio_explanation', 'optimization', 'general')),
	messages TEXT NOT NULL, -- JSON array of messages
	created_at INTEGER NOT NULL DEFAULT (unixepoch()),
	updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON investment_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_strategy_id ON accounts(strategy_id);
CREATE INDEX IF NOT EXISTS idx_setup_steps_account_id ON account_setup_steps(account_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_retirement_plans_user_id ON retirement_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_optimizations_user_id ON tax_optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);


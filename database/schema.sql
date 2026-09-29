CREATE TABLE IF NOT EXISTS users (
    telegram_id BIGINT PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'IDR',
    monthly_salary DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('income', 'expense', 'salary')),
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_targets (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
    target_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    collected_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_date ON transactions(telegram_id, created_at);
const db = require('../config/db');

async function getOrCreateUser(telegramId, username = '', firstName = '') {
    const res = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    if (res.rows.length === 0) {
        const newUser = await db.query(
            'INSERT INTO users (telegram_id, username, first_name) VALUES ($1, $2, $3) RETURNING *',
            [telegramId, username, firstName]
        );
        return newUser.rows[0];
    }
    return res.rows[0];
}

async function setCurrency(telegramId, currency) {
    await db.query('UPDATE users SET currency = $1 WHERE telegram_id = $2', [currency.toUpperCase(), telegramId]);
}

async function setSalary(telegramId, amount) {
    await getOrCreateUser(telegramId);
    await db.query('UPDATE users SET monthly_salary = $1 WHERE telegram_id = $2', [amount, telegramId]);
    await db.query(
        'INSERT INTO transactions (telegram_id, type, amount, category, description) VALUES ($1, $2, $3, $4, $5)',
        [telegramId, 'salary', amount, 'Gaji', 'Gaji Bulanan']
    );
}

async function addTransaction(telegramId, type, amount, category, description) {
    await getOrCreateUser(telegramId);
    await db.query(
        'INSERT INTO transactions (telegram_id, type, amount, category, description) VALUES ($1, $2, $3, $4, $5)',
        [telegramId, type, amount, category, description]
    );
}

async function getSummary(telegramId) {
    const user = await getOrCreateUser(telegramId);

    const incomeRes = await db.query(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE telegram_id = $1 AND type IN ('income', 'salary')",
        [telegramId]
    );
    const expenseRes = await db.query(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE telegram_id = $1 AND type = 'expense'",
        [telegramId]
    );

    const totalIncome = parseFloat(incomeRes.rows[0].total);
    const totalExpense = parseFloat(expenseRes.rows[0].total);
    const balance = totalIncome - totalExpense;

    return {
        currency: user.currency,
        salary: parseFloat(user.monthly_salary),
        totalIncome,
        totalExpense,
        balance
    };
}

async function getMonthlyDetails(telegramId, month = null, year = null) {
    const now = new Date();
    const m = month || (now.getMonth() + 1);
    const y = year || now.getFullYear();

    const transactions = await db.query(
        `SELECT * FROM transactions 
     WHERE telegram_id = $1 
     AND EXTRACT(MONTH FROM created_at) = $2 
     AND EXTRACT(YEAR FROM created_at) = $3
     ORDER BY created_at DESC`,
        [telegramId, m, y]
    );

    const categoriesRes = await db.query(
        `SELECT category, SUM(amount) as total 
     FROM transactions 
     WHERE telegram_id = $1 AND type = 'expense'
     AND EXTRACT(MONTH FROM created_at) = $2 
     AND EXTRACT(YEAR FROM created_at) = $3
     GROUP BY category`,
        [telegramId, m, y]
    );

    return {
        transactions: transactions.rows,
        categories: categoriesRes.rows
    };
}

async function setTarget(telegramId, targetName, amount) {
    await getOrCreateUser(telegramId);
    const res = await db.query(
        'INSERT INTO financial_targets (telegram_id, target_name, target_amount) VALUES ($1, $2, $3) RETURNING *',
        [telegramId, targetName, amount]
    );
    return res.rows[0];
}

async function getTargets(telegramId) {
    const res = await db.query('SELECT * FROM financial_targets WHERE telegram_id = $1', [telegramId]);
    return res.rows;
}

module.exports = {
    getOrCreateUser,
    setCurrency,
    setSalary,
    addTransaction,
    getSummary,
    getMonthlyDetails,
    setTarget,
    getTargets
};
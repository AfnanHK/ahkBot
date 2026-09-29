const { getSummary } = require('../services/financeService');
const { formatCurrency } = require('../utils/formatter');

module.exports = {
    name: 'saldo',
    async execute(ctx) {
        const summary = await getSummary(ctx.from.id);
        const msg = `💰 *RINGKASAN SALDO*
    
• Gaji Pokok: ${formatCurrency(summary.salary, summary.currency)}
• Total Pemasukan: ${formatCurrency(summary.totalIncome, summary.currency)}
• Total Pengeluaran: ${formatCurrency(summary.totalExpense, summary.currency)}
----------------------------------
💵 *Sisa Saldo*: ${formatCurrency(summary.balance, summary.currency)}`;

        ctx.reply(msg, { parse_mode: 'Markdown' });
    }
};
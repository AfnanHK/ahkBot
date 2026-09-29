const { getOrCreateUser, setSalary } = require('../services/financeService');
const { formatCurrency } = require('../utils/formatter');

module.exports = {
    name: 'gaji',
    async execute(ctx) {
        const match = ctx.message.text.match(/\/gaji\s+([\d.,]+)/);
        const amount = match ? parseInt(match[1].replace(/[.,]/g, ''), 10) : NaN;

        if (!amount || amount <= 0) {
            return ctx.reply('⚠️ Format salah! Gunakan: /gaji <jumlah>\nContoh: /gaji 5000000');
        }

        const user = await getOrCreateUser(
            ctx.from.id,
            ctx.from.username || '',
            ctx.from.first_name || ''
        );
        await setSalary(ctx.from.id, amount);

        ctx.reply(`✅ Gaji bulanan diset ke ${formatCurrency(amount, user.currency)}`);
    }
};

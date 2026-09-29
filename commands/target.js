const { setTarget, getTargets } = require('../services/financeService');
const { formatCurrency } = require('../utils/formatter');

module.exports = {
    name: 'target',
    async execute(ctx) {
        const text = ctx.message.text.split(' ');

        if (text.length === 1) {
            const targets = await getTargets(ctx.from.id);
            if (targets.length === 0) return ctx.reply('Belum ada target keuangan.');

            let msg = '🎯 *TARGET KEUANGAN ANDA*\n\n';
            targets.forEach(t => {
                const percent = Math.min(100, Math.round((t.collected_amount / t.target_amount) * 100));
                msg += `📌 *${t.target_name}*\n${formatCurrency(t.collected_amount)} / ${formatCurrency(t.target_amount)}\nProgress: ${percent}%\n\n`;
            });
            return ctx.reply(msg, { parse_mode: 'Markdown' });
        }

        const name = text[1];
        const amount = parseFloat(text[2]);

        if (!name || isNaN(amount)) {
            return ctx.reply('⚠️ Format salah! Gunakan: /target <nama> <jumlah>\nContoh: /target Laptop 10000000');
        }

        await setTarget(ctx.from.id, name, amount);
        ctx.reply(`🎯 Target *${name}* sebesar ${formatCurrency(amount)} berhasil dibuat!`, { parse_mode: 'Markdown' });
    }
};
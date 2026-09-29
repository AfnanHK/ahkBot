const { setCurrency } = require('../services/financeService');

module.exports = {
    name: 'matauang',
    async execute(ctx) {
        const text = ctx.message.text.split(' ');
        const curr = text[1];

        if (!curr) {
            return ctx.reply('⚠️ Format salah! Gunakan: /matauang <IDR|USD|EUR|SGD>');
        }

        await setCurrency(ctx.from.id, curr);
        ctx.reply(`✅ Mata uang berhasil diubah menjadi *${curr.toUpperCase()}*`, { parse_mode: 'Markdown' });
    }
};
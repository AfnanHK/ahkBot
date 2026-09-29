const { getCategoryKeyboard } = require('../handlers/categoryHandler');

module.exports = {
    name: 'masuk',
    async execute(ctx) {
        const args = ctx.message.text.match(/\/masuk\s+(\d+)(?:\s+"([^"]+)")?/);
        if (!args) {
            return ctx.reply('⚠️ Format salah! Gunakan: /masuk <jumlah> "<keterangan>"\nContoh: /masuk 100000 "Bonus Project"');
        }

        const amount = args[1];
        const description = args[2] || 'Pemasukan';

        await ctx.reply('Pilih Kategori Pemasukan:', getCategoryKeyboard('in', amount, description));
    }
};
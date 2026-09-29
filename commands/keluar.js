const { getCategoryKeyboard } = require('../handlers/categoryHandler');

module.exports = {
    name: 'keluar',
    async execute(ctx) {
        const args = ctx.message.text.match(/\/keluar\s+(\d+)(?:\s+"([^"]+)")?/);
        if (!args) {
            return ctx.reply('⚠️ Format salah! Gunakan: /keluar <jumlah> "<keterangan>"\nContoh: /keluar 50000 "Makan Siang"');
        }

        const amount = args[1];
        const description = args[2] || 'Pengeluaran';

        await ctx.reply('Pilih Kategori Pengeluaran:', getCategoryKeyboard('out', amount, description));
    }
};
const { resetPeriod } = require('../services/financeService');

module.exports = {
    name: 'reset',
    async execute(ctx) {
        const arg = ctx.message.text.split(' ')[1];
        if (arg !== 'ya') {
            return ctx.reply('⚠️ Ini akan mengosongkan saldo dan gaji dari 0.\nRiwayat lama tetap tersimpan.\n\nKetik /reset ya untuk lanjut.');
        }
        await resetPeriod(ctx.from.id);
        ctx.reply('✅ Periode baru dimulai. Saldo kembali ke Rp0.');
    }
};

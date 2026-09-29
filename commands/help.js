module.exports = {
    name: 'help',
    execute(ctx) {
        const helpMsg = `🤖 *DAFTAR PERINTAH BOT KEUANGAN*

📌 *Pencatatan:*
• \`/gaji <jumlah>\` - Set gaji bulanan & dapatkan alokasi AI
• \`/masuk <jumlah> "<keterangan>"\` - Catat pemasukan
• \`/keluar <jumlah> "<keterangan>"\` - Catat pengeluaran

📊 *Laporan & Analisis:*
• \`/saldo\` - Cek ringkasan saldo
• \`/laporan_bulanan\` - Laporan & Analisis AI
• \`/export <excel|pdf>\` - Download Laporan (.xlsx / .pdf)

🎯 *Target & Pengaturan:*
• \`/target\` - Cek semua target
• \`/target <nama> <jumlah>\` - Tambah target baru
• \`/matauang <IDR|USD>\` - Ubah mata uang`;

        ctx.reply(helpMsg, { parse_mode: 'Markdown' });
    }
};
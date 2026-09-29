const cron = require('node-cron');
const db = require('../config/db');

function initCronJobs(bot) {
    // Pengingat Harian (Jam 20:00)
    cron.schedule('0 20 * * *', async () => {
        try {
            const users = await db.query('SELECT telegram_id FROM users');
            users.rows.forEach((u) => {
                bot.telegram.sendMessage(
                    u.telegram_id,
                    '🔔 *Pengingat Harian*: Jangan lupa catat pengeluaran kamu hari ini dengan /keluar ya!',
                    { parse_mode: 'Markdown' }
                );
            });
        } catch (err) {
            console.error('Error Cron Job:', err);
        }
    });

    // Pengingat Mingguan (Setiap Minggu Jam 09:00)
    cron.schedule('0 9 * * 0', async () => {
        try {
            const users = await db.query('SELECT telegram_id FROM users');
            users.rows.forEach((u) => {
                bot.telegram.sendMessage(
                    u.telegram_id,
                    '💡 *Pengingat Mingguan*: Cek target keuangan kamu dengan /target & selisihkan tabungan minggu ini!',
                    { parse_mode: 'Markdown' }
                );
            });
        } catch (err) {
            console.error('Error Cron Job:', err);
        }
    });
}

module.exports = { initCronJobs };
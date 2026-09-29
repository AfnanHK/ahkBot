const { getSummary, getMonthlyDetails } = require('../services/financeService');
const { analyzeFinancialHealth } = require('../services/aiService');
const { formatCurrency } = require('../utils/formatter');

module.exports = {
    name: 'laporan_bulanan',
    async execute(ctx) {
        ctx.reply('📊 Menyusun laporan bulanan & analisis AI...');
        const summary = await getSummary(ctx.from.id);
        const details = await getMonthlyDetails(ctx.from.id);

        let categoryText = '';
        details.categories.forEach((c) => {
            categoryText += `- ${c.category}: ${formatCurrency(c.total, summary.currency)}\n`;
        });

        const aiAnalysis = await analyzeFinancialHealth(summary, details);

        const reportMsg = `📈 *LAPORAN KEUANGAN BULAN INI*

💵 Total Pemasukan: ${formatCurrency(summary.totalIncome, summary.currency)}
💸 Total Pengeluaran: ${formatCurrency(summary.totalExpense, summary.currency)}
💰 Sisa Saldo: ${formatCurrency(summary.balance, summary.currency)}

📂 *Rincian Kategori*:
${categoryText || 'Belum ada pengeluaran.'}

🤖 *Analisis & Prediksi AI*:
${aiAnalysis}`;

        ctx.reply(reportMsg, { parse_mode: 'Markdown' });
    }
};
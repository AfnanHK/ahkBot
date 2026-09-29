const { generateExcelReport, generatePDFReport } = require('../services/exportService');

module.exports = {
    name: 'export',
    async execute(ctx) {
        const args = ctx.message.text.split(' ');
        const type = args[1] ? args[1].toLowerCase() : 'excel';

        ctx.reply('⏳ Memproses dokumen export...');

        if (type === 'pdf') {
            const pdfBuffer = await generatePDFReport(ctx.from.id);
            await ctx.replyWithDocument({ source: pdfBuffer, filename: 'Laporan_Keuangan.pdf' });
        } else {
            const excelBuffer = await generateExcelReport(ctx.from.id);
            await ctx.replyWithDocument({ source: excelBuffer, filename: 'Laporan_Keuangan.xlsx' });
        }
    }
};
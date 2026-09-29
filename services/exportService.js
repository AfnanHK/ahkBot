const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');
const { getMonthlyDetails, getSummary } = require('./financeService');
const { formatCurrency } = require('../utils/formatter');

async function generateExcelReport(telegramId) {
    const summary = await getSummary(telegramId);
    const details = await getMonthlyDetails(telegramId);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan Keuangan');

    sheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Tanggal', key: 'created_at', width: 20 },
        { header: 'Tipe', key: 'type', width: 15 },
        { header: 'Kategori', key: 'category', width: 20 },
        { header: 'Jumlah', key: 'amount', width: 20 },
        { header: 'Keterangan', key: 'description', width: 30 },
    ];

    details.transactions.forEach((tx) => {
        sheet.addRow({
            id: tx.id,
            created_at: new Date(tx.created_at).toLocaleString('id-ID'),
            type: tx.type.toUpperCase(),
            category: tx.category,
            amount: formatCurrency(tx.amount, summary.currency),
            description: tx.description
        });
    });

    return await workbook.xlsx.writeBuffer();
}

async function generatePDFReport(telegramId) {
    const summary = await getSummary(telegramId);
    const details = await getMonthlyDetails(telegramId);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        doc.fontSize(18).text('LAPORAN KEUANGAN PRIBADI', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Total Pemasukan : ${formatCurrency(summary.totalIncome, summary.currency)}`);
        doc.text(`Total Pengeluaran: ${formatCurrency(summary.totalExpense, summary.currency)}`);
        doc.text(`Sisa Saldo        : ${formatCurrency(summary.balance, summary.currency)}`);
        doc.moveDown();

        const table = {
            title: "Riwayat Transaksi Bulan Ini",
            headers: ["Tanggal", "Tipe", "Kategori", "Jumlah", "Keterangan"],
            rows: details.transactions.map(tx => [
                new Date(tx.created_at).toLocaleDateString('id-ID'),
                tx.type.toUpperCase(),
                tx.category,
                formatCurrency(tx.amount, summary.currency),
                tx.description || '-'
            ])
        };

        doc.table(table, { prepareHeader: () => doc.fontSize(10).font('Helvetica-Bold'), prepareRow: () => doc.fontSize(9).font('Helvetica') });
        doc.end();
    });
}

module.exports = { generateExcelReport, generatePDFReport };
function formatCurrency(amount, currency = 'IDR') {
    const numericAmount = parseFloat(amount) || 0;
    if (currency === 'IDR') {
        return 'Rp' + numericAmount.toLocaleString('id-ID');
    }
    return `${currency} ${numericAmount.toLocaleString('en-US')}`;
}

module.exports = { formatCurrency };
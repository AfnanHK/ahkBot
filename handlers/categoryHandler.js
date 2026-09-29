const { Markup } = require('telegraf');

const CATEGORIES = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Pendidikan', 'Tabungan', 'Lainnya'];

function getCategoryKeyboard(actionPrefix, amount, description) {
    const buttons = CATEGORIES.map((cat) => [
        Markup.button.callback(cat, `${actionPrefix}:${cat}:${amount}:${description}`)
    ]);
    return Markup.inlineKeyboard(buttons);
}

module.exports = { CATEGORIES, getCategoryKeyboard };
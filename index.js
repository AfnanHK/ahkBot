require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { addTransaction } = require('./services/financeService');
const { initCronJobs } = require('./scheduler/cronJobs');
const { startExpressServer } = require('./webhook/server');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Dynamic Command Loader
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name && typeof command.execute === 'function') {
      bot.command(command.name, (ctx) => command.execute(ctx));
      console.log(`[LOADED] Command /${command.name}`);
    }
  }
}

// Inline Callback Query Handler
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data.split(':');
  const action = data[0];
  const category = data[1];
  const amount = parseFloat(data[2]);
  const description = data[3];

  if (action === 'in' || action === 'out') {
    const type = action === 'in' ? 'income' : 'expense';
    await addTransaction(ctx.from.id, type, amount, category, description);

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `✅ *${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} Berhasil Dicatat!*\n\n• Kategori: ${category}\n• Jumlah: Rp${amount.toLocaleString('id-ID')}\n• Ket: ${description}`,
      { parse_mode: 'Markdown' }
    );
  }
});

initCronJobs(bot);
startExpressServer();

bot.launch().then(() => {
  console.log('🤖 Bot Telegram Keuangan Berhasil Berjalan!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
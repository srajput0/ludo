from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "7882173382:AAGFqT3FNolrkIHmn83uG2CsFDS1bDgBZ-s"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("🎮 Play Ludo", url="https://ludonsnbs.duckdns.org")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Welcome to Ludo Game! 🎲\nClick below to start playing 👇",
        reply_markup=reply_markup
    )

if __name__ == "__main__":
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

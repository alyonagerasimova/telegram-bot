const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('/options');
const token = "6295481522:AAG-A5PhRWKUNVyxaK0_wW0qrm2Ah7OSlyw";

const bot = new TelegramBot(token, {polling: true});

bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"},
    {command: "/info", description: "Информация о пользователе"},
    {command: "/game", description: "Игра"},
]);

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Давай сыграем в игру. Я загадаю цифру от 0 до 9, а ты должен ее отгадать`);
    const random = Math.floor(Math.random() * 10);
    chats[chatId] = random;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}

const start = () => {
    bot.on("message", async msg => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/06c/d14/06cd1435-9376-40d1-b196-097f5c30515c/12.webp");
            return bot.sendMessage(chatId, "Стартуем!");
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй снова");
    });

    bot.on("callback_query", async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;

        if (data === "/again") {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "6314560295:AAHXBKNrOdXB5zNbpCFFvY4uXNk-hsOd0kM";
const server = express();
const bot = new TelegramBot(TOKEN, {
    polling: true
});
const port = process.env.PORT || 5000;
const gameName = "CatMerge";
const queries = {};
server.use(express.static(path.join(__dirname, 'CatMergerBuilder')));
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
// bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.onText(/start|game/, (msg) => { 
    console.log("[msg]: ", msg); 
    console.log("[gameName]: ", gameName); 
    try { 
        let gameurl = "https://tindvor239.github.io/Telegram_Merge_HTML5/"; 
        // bot.sendGame(msg.from.id, gameName) 
        bot.sendMessage(msg.from.id, "ok game!", { 
            reply_markup: { 
                inline_keyboard: [[{ 
                    text: "AHIHI", 
                    web_app: { 
                        url: gameurl 
                    } 
                }]] 
            } 
        }) 
    } catch (err) { 
        console.log("[ERR]: ", err); 
    } 
});
bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://tindvor239.github.io/Telegram_Merge_HTML5/";
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});
bot.on("inline_query", function (iq) {
    bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: gameName
    }]);
});
server.get("/highscore/:score", function (req, res, next) {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    bot.setGameScore(query.from.id, parseInt(req.params.score), options,
        function (err, result) {});
});
server.listen(port);
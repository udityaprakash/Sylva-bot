const express = require('express');
const { Telegraf } = require('telegraf');
const TextToSpeechConverter = require('text-to-speech-converter');
const fs = require('fs');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;


const BOT_TOKEN = process.env.BOT_TOKEN;


const bot = new Telegraf(BOT_TOKEN);


bot.start(ctx => ctx.reply('Welcome to Sylva! Send me text and I will send you a voice note.'));

bot.on('text', async ctx => {
    try {
        const text = ctx.message.text;
        const voiceNote = await convertTextToVoice(text);
        const audio = fs.readFileSync(voiceNote + ".mp3");
        ctx.replyWithVoice({ source: audio });
        ctx.reply('Voice Note will be deleted in few minutes.');
        setTimeout(() => {
            ctx.deleteMessage(ctx.message.message_id);
            // bot.telegram.deleteMessage(sentMessage.chat.id, sentMessage.message_id);
        }, 20000);
    } catch (error) {
        console.error('Error processing text:', error);
        ctx.reply('Sylva is currently Struggling to respond. Please try again after some time.');
    }
});


async function convertTextToVoice(text) {
    const outputFilePath = 'latestvoice';
    await TextToSpeechConverter(text, outputFilePath);
    return outputFilePath;
}


bot.launch();


app.get('/', (req, res) => {
    res.send('Bot is running!');
});


app.listen(port, () => {
    console.log(`Server has started to respond ${port}`);
});

const dayjs = require('dayjs');
const { Client, Intents } = require('discord.js');
const reg = require('./reg');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
    console.log('Bow down to me humans!');
});

const kurumizawa = /(kurumizawa|胡桃沢)?\s*/;
const satania = /(satan(i|y|ichi)a|Сатании|サタニキア|サターニャ|사타냐|萨塔妮娅)\s*-?/;
const mcdowell = /(mcdowellu?|マクドウェル)?\s*/;
const honorifics = /(sama|san|chan|senpai|さま|様|さん|ちゃん|せんぱい|先輩)?\s*/;
const extra = /[!！¡﹗︕‼¿？⁉﹖︖⁈⁇?~˜～〜]*/;
const sataniaName = reg`${kurumizawa}${satania}${mcdowell}${honorifics}`;

const happyBirthday = /happy\s*(birthday|bday|day\s*of\s*(the)?\s*birth)/;
const tanjoubiOmedetou = /(お?(たんじょうび|誕生日)おめでとう(ございます|です)?)/;
const frenchBirthday = /(joyeu(x|se)?|bon(ne)?)\s*(ann?iv(erss?aire?)?|f[êe]te)s?/;
const spanishBirthday = /feliz\s*(cumplea[ñn]os|cumple)/;
const portugueseBirthday = /(feliz\s*anivers[áa]rio)|Parab[ée]ns/;

const sentences = [
	reg`${happyBirthday},?\s*${sataniaName}`, // English
	reg`${sataniaName},?\s*${happyBirthday}`,
	reg`${sataniaName}、?${tanjoubiOmedetou}${/よ?ね?/}`, // Japanese
	reg`${tanjoubiOmedetou}、?${sataniaName}`,
	reg`${spanishBirthday},?${sataniaName}`, // Spanish
	reg`${sataniaName},?${spanishBirthday}`,
	reg`${frenchBirthday},?\s*${sataniaName}`, // French
	reg`${sataniaName},?\s*${frenchBirthday}`,
	reg`${portugueseBirthday},?\s*${sataniaName}`, // Portuguese
	reg`${sataniaName},?\s*${portugueseBirthday}`
];

const trigger = reg.i`^(${extra}${sentences}${extra})$`;
const reactWith = ['876101274104373298', '🎉', '🎂'];

client.on('messageCreate', async message => {
    const day = dayjs().date();
    if (!dayjs().month() === 7 || day < 14 || day > 16 || !trigger.test(message.content)) {
        return;
    }

    async function handleEdit(_, newMessage) {
        if (newMessage.id === message.id && !trigger.test(newMessage.content)) {
            try {
                await newMessage.reactions.removeAll();
            } catch (error) {
                await message.reply("I'm not able to remove reactions. Please check the permissions");
            }
        } else {
            client.once('messageUpdate', handleEdit);
        }
    }
    // Listen to any edit to combat abuse of the command
    client.once('messageUpdate', handleEdit);

    for (const react of reactWith) {
        try {
            await message.react(react);
        } catch (error) {
            await message.reply('I seem to not be able to react! Please check the permissions');
            return;
        }
    }
});

client.login(process.env.BOT_TOKEN);
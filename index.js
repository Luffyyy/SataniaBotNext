import { Client, Intents, Collection } from 'discord.js';
import commands from './commands/index.js';
import { REST } from '@discordjs/rest';

import dotenv from 'dotenv';
import { Routes } from 'discord-api-types/v9';
import axios from 'axios';
import fs from 'fs';
import reg from './utils/reg.js';
dotenv.config();

const pkg = JSON.parse(fs.readFileSync('package.json'));

axios.defaults.headers['User-Agent'] = `${pkg.name} ${pkg.repository}`;
axios.defaults.headers.Accept = "application/json";

const FLAGS = Intents.FLAGS;
const client = new Client({ intents: [FLAGS.GUILDS, FLAGS.GUILD_MESSAGES, FLAGS.GUILD_MESSAGE_REACTIONS, FLAGS.GUILD_PRESENCES, FLAGS.GUILD_EMOJIS_AND_STICKERS] });

client.on('ready', () => {
    console.log('Bow down to me humans!');
});

const rest = new REST({version: '9'}).setToken(process.env.BOT_TOKEN);

client.commands = new Collection();
const jsonCommands = [];
const legacyCommands = [];
commands.forEach(command => {
    if (command.data !== undefined) {
        client.commands.set(command.data.name, command);
        jsonCommands.push(command.data.toJSON());
    } else {
        legacyCommands.push(command);
    }
});

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, '310180409541394432'),
			{ body: jsonCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const PREFIX = /s!/;

client.on('messageCreate', async message => {
	if (message.author.id === process.env.APP_ID) {
		return;
	}
    for (const command of legacyCommands) {
		let trigger = command.trigger;
		let content = / .+/;
		let legacyCommand = command.legacyCommand && new RegExp(command.legacyCommand) || '';
		if (legacyCommand) {
			if (command.contentRequired === false) {
				content = /\s?.*/;
			}
			trigger = reg`${PREFIX}${legacyCommand}${content}`;
		}

		if (trigger) {
			trigger = reg`^${trigger}$`;
			if (trigger.test(message.content)) {
				message.commandContent = message.content.replace(reg`${PREFIX}${legacyCommand}\s?`, '');
			} else {
				continue;
			}
		} 
        if (await command.tryExecute(message, client)) {
            break;
        }
    }
});

client.on('interactionCreate', async interaction => {
    const { commandName } = interaction;
	if (!interaction.isCommand() || !client.commands.has(commandName)) {
        return;
    }

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		console.log(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.BOT_TOKEN);

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ', err);
});
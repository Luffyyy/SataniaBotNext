import { Client, Intents, Collection } from 'discord.js';
import commands from './commands/index.js';
import { REST } from '@discordjs/rest';

import dotenv from 'dotenv';
import { Routes } from 'discord-api-types/v9';
import axios from 'axios';
import fs from 'fs';
dotenv.config();

const pkg = JSON.parse(fs.readFileSync('package.json'));

axios.defaults.headers['User-Agent'] = `${pkg.name} ${pkg.repository}`;
axios.defaults.headers.Accept = "application/json";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES] });

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
			Routes.applicationGuildCommands(process.env.APP_ID, '769411299485810698'),
			{ body: jsonCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('messageCreate', async message => {
    for (const command of legacyCommands) {
        if ((!command.trigger || command.trigger.test(message.content)) && await command.tryExecute(message, client)) {
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
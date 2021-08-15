import { ACTIVITY_TYPES, findGameType, listGames, searchGames } from '../utils/game-utils.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import fixEmbeds from '../utils/fix-embeds.js';
const LINES_PER_FIELD = 10;
const MAX_EMBED_FIELDS = 6;
const MAX_EMBED_LENGTH = 5750;

export default {
    async execute(interaction) {
        let query = interaction.options.getString('query');

        if (!interaction.guild) {
            interaction.reply('**Error:** This command must be used in a server.');
            return;
        }

        // Logic when the user does not specify a query
        // Sets the query to the user's playing status
        // Or ask the user to specify a query if they aren't playing anything
        let title = '';
        let footer;
        let description = '';
        const fields = [];
        if (!query) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            const activities = member.presence.activities;

            if (activities.length === 0) {
                interaction.reply('Please specify a game to look up, or start playing a game to find out who else is playing it!');
                return;
            }

            footer = 'Since you did not specify a game to look up, the game you were currently playing was used instead.';
            query = activities[0].name;
        }

        const presences = interaction.guild.presences.cache;
        const users = interaction.client.users.cache;
        const games = listGames(presences);

        const results = searchGames(query, presences);

        await interaction.deferReply();

        // Stop there is no games match
        if (results.length === 0) {
            title = `Playing ${query}`;
            description = '*(no one)*';
        } else {
            const gameName = results[0].name;
    
            let lines;
    
            if (interaction.guild.large) {
                lines = games.get(gameName).map(id => `• ${users.get(id).tag}`);
            } else {
                lines = games.get(gameName).map(id => `• <@${id}>`);
            }

            const gameType = findGameType(gameName, presences);
    
            title = `${ACTIVITY_TYPES[gameType] || ''} ${gameName} (${lines.length} ${lines.length > 1 ? 'users' : 'user'})`;
    
            // Stores the total length of the embed
            // To avoid reaching the limit of 6000 characters
            let totalLength = title.length;
    
            while (lines.length > 0) {
                const row = lines.splice(0, LINES_PER_FIELD).join('\n');

                // Add the description length and 16 (for the title) to the total length
                totalLength += description.length + 16;
    
                if (totalLength > MAX_EMBED_LENGTH || fields.length >= MAX_EMBED_FIELDS) {
                    description += '\n\n**Note**: Some results were omitted because there were too many of them.';
                    break;
                }

                fields.push({name: row, value: '\u200b', inline: true});
            }
    
            if (!footer && results.length > 1) {
                footer = `${results.length - 1} other ${results.length > 2 ? 'games' : 'game'} matched your query. Use "s!searchgames ${query}" to see them!`;
            }
        }

        await interaction.editReply({
            content: ' ',
            embeds: [fixEmbeds({
                color: 0xee6666,
                title,
                footer,
                fields,
                description
            })]
        });
    },
    data: new SlashCommandBuilder()
        .setName('playing')
        .setDescription('Find out who is playing a certain game, the game you are currently playing will be used by default')
        .addStringOption(option => {
            return option.setName('query')
                .setDescription('Query for the game you wish to search for')
                .setRequired(false);
        })
};
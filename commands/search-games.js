import { searchGames, ACTIVITY_TYPES, findGameType } from '../utils/game-utils.js';
import { SlashCommandBuilder } from "@discordjs/builders";
const MAX_RESULTS = 20;

export default {
    async execute(interaction) {
        const query = interaction.options.getString('query');

        if (!interaction.guild) {
            interaction.reply('**Error:** This command must be used in a server.');
            return;
        }

        const presences = interaction.guild.presences.cache;
        const results = searchGames(query, presences);
    
        // Stop there is no games match
        let desc = '';
        if (results.length > 0) {
            desc = results.map(game => {
                const activity = ACTIVITY_TYPES[findGameType(game.name, presences)];
                if (activity) {
                    const users = game.users.length;
                    return `  • ${activity} **${game.name}** (${users.toLocaleString()} user${users > 1 ? 's' : ''})`;
                }
            });
            desc = desc.slice(0, MAX_RESULTS).join('\n');
        } else {
            desc ='*(none)*';
        }
    
        if (results.length > MAX_RESULTS) {
            desc += `\n...and ${(results.length - MAX_RESULTS).toLocaleString()} more results`;
        }
    
        await interaction.reply({
            content: ' ',
            embeds: [{
                color: 0xee6666,
                title: `Games matching "${query}" on this server`,
                description: desc
            }]
        });
    },
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Search among the games played on your server')
        .addStringOption(option => {
            return option.setName('query')
                .setDescription('Query for the game you wish to search for')
                .setRequired(true);
        })
};
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

export default {
    async execute(interaction) {
        try {
            const data = await axios.get('https://icanhazdadjoke.com').then(res => res.data);
            const link = `[[link]](https://icanhazdadjoke.com/j/${data.id})`;
        
            await interaction.reply({
                content: ' ',
                embeds: [{
                    color: 0xee6666,
                    // That's an en space, it's a bit wider than a regular space
                    description: data.joke + '\u2002' + link,
                    footer: {
                        text: 'Powered by icanhazdadjoke.com',
                        icon_url: 'https://icanhazdadjoke.com/static/favicon-32x32.png'
                    }
                }]
            });
        } catch (error) {
            interaction.reply("Couldn't get you a spicy dad joke sadly. Ask the bot developer what's wrong with the command");
            console.error(error.message);
        }
    },
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random joke, pretty generic command')
};
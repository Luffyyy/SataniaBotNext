import { SlashCommandBuilder } from "@discordjs/builders";
import fs from 'fs';

const smugs = JSON.parse(fs.readFileSync('assets/smug-list.json'));

export default {
    async execute(interaction) {
        const selectedSmug = parseInt(interaction.options.getString('which') || Math.floor(Math.random() * smugs.length) + 1);

        let image = smugs[(((selectedSmug - 1) % smugs.length) + smugs.length) % smugs.length];
    
        if (!isFinite(selectedSmug)) {
            interaction.reply(`**Number too big, smug machine :b:roke**, we only have ${Number.MAX_VALUE} smugs`);
            return;
        }

        if (selectedSmug === 666) {
            image = 'https://i.imgur.com/LmDVxxy.png';
        }

        const extension = image.match(/.+\.(\w+)/i)[1];

        await interaction.deferReply();
        await interaction.editReply({
            content: `**Here is smug #${selectedSmug}**`,
            files: [{
                name: `Smug_${selectedSmug}.${extension}`,
                attachment: image
            }]
        });
    },
    data: new SlashCommandBuilder()
        .setName('smug')
        .setDescription('Sends a picture of a smug anime character')
        .addStringOption(option => {
            return option.setName('which')
                .setDescription('Allows you to specify a specific smuggy picture instead of a randomized one')
                .setRequired(false);
        })
};
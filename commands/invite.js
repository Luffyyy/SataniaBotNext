import { Permissions } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    async execute(interaction) {
        const link = await interaction.client.generateInvite({
            permissions: [
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.MANAGE_CHANNELS,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                Permissions.FLAGS.USE_EXTERNAL_STICKERS,
                Permissions.FLAGS.ADD_REACTIONS,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.ATTACH_FILES,
            ],
            scopes: ['bot', 'applications.commands']
        });

        return interaction.reply(
            '♥ **Thank you for inviting me to your server!**\n\n' +
            `Just open this link in your browser and follow the instructions!\n**<${link}>**`
        );
    },
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get a link to invite me to your server!')
};
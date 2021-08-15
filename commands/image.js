import resolveLink from '../utils/relevant-link.js';
import fetchImage from '../utils/fetch-image.js';
import { isSVG } from '../utils/svg-utils.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import fileType from 'file-type';

export default {
    async tryExecute(message) {
        const link = resolveLink(message);

        if (!link) {
            return message.reply({content: 'Could not find an image <a:gifSataniaCry:411828099680960512>', ephemeral: true});
        }

        const file = await fetchImage(link.url);
        let ext = fileType.fromBuffer(file);
    
        if (ext) {
            ext = ext.ext;
        } else if (isSVG(file)) {
            ext = 'svg';
        }
    
        return message.reply(
            `**Name**: ${link.name}\n**Type**: ${link.type}\n**Source**: \`${link.source}\`\n**URL**: <${link.url}>`.trim(),
            {
                files: [{
                    name: `image.${ext}`,
                    attachment: file
                }]
            }
        );
    },
    legacyCommand: 'image',
    contentRequired: false,
    dataa: new SlashCommandBuilder()
        .setName('image')
        .setDescription(' ')
        .addStringOption(option => {
            return option.setName('query')
                .setDescription(' ')
                .setRequired(true);
        })
};
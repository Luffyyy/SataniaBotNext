import { SlashCommandBuilder } from "@discordjs/builders";
import { sleep } from "../utils/sleep.js";

const winstreak = {};

export default {
    async execute(interaction) {
        const user = interaction.options.getUser('cowboy');
        const initiator = interaction.user;

        if (initiator.id === user.id) {
			await interaction.reply(`**<@${initiator.id}>** successfully killed themselves with a bullet in their head 😂🔫`);
			return;
		}

        // Do this before the waiting to not break the counter because of race conditions
        const challenge = user.id === process.env.APP_ID;
		let duelers = [initiator, user];
        let chance = 0.5;
        if (challenge) {
            chance = 0.01;
        } 
        
        if (Math.random() >= chance) {
			duelers = duelers.reverse();
		}

		const [winner, loser] = duelers;

		winstreak[winner.id] = winstreak[winner.id] + 1 || 1;
		winstreak[loser.id] = 0;
        const actualStreak = winstreak[winner.id];

        let content = `**<@${initiator.id}>** and **<@${user.id}>** start a duel...`;
        if (challenge) {
            content = `You dare challenge me?...`
        }
        await interaction.reply(content);
		await sleep(1250);

        async function editReply(newContent, last=false) {
            content = await interaction.editReply(content + newContent).then(res => res.content);
            if (!last) {
                await sleep(1000);
            }
        }

		await editReply('Ready...');
		await editReply('**FIRE!**');
		await editReply(`\n\n**<@${winner.id}> won the duel** and killed <@${loser.id}>!`);
        await editReply(` \`Winstreak: ${actualStreak}\``);
    },
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('For fixing problems like real cowboys! One of you will win, the other will die, good luck!')
        .addUserOption(option => {
            return option.setName('cowboy')
                .setDescription('The other cowboy you wanna shoot!')
                .setRequired(true);
        })
};
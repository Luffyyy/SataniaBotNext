import { SlashCommandBuilder } from "@discordjs/builders";
import { all, create, evaluate, parse } from "mathjs";
import { StaticPool } from "node-worker-threads-pool";

const pool = new StaticPool({
    size: 8,
    task: "./workers/calc-stuff.js"
});

export default {
    async execute(interaction) {
        const expression = interaction.options.getString('expression').replaceAll('π', 'pi').replaceAll('\`', '\\`');
        if (expression.toLowerCase() === 'satania') {
            interaction.reply('Satania = qtπ');
        } else {
            await interaction.deferReply();
            try {
                const result = await pool.createExecutor().setTimeout(1000).exec({ expression }).then(res => res.replaceAll('\n', ''));
                const codeBlock = '```';
                const prettyExpr = parse(expression);

                await interaction.editReply(`${codeBlock}wl\n${prettyExpr} = ${result}\n${codeBlock}`);
            } catch (error) {
                console.log(error);
                await interaction.editReply("I am unable to calculate this, sorry ;-;")                
            }
        }
    },
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculates a mathematical expression')
        .addStringOption(option => {
            return option.setName('expression')
                .setDescription('The expression to calculate')
                .setRequired(true);
        })
};
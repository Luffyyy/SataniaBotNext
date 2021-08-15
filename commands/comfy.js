import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import fixEmbeds from "../utils/fix-embeds.js";

const RATING_ARRAY = [
	'MEGA COMFY',
	'EXTREMELY Comfy',
	'VERY Comfy',
	'Pretty Comfy',
	'Comfy',
	'A Little Comfy',
	'Not Very Comfy...',
	'Not Comfy...',
	'N O   C O M F Y'
].reverse();

// Max amount of comfiness obtainable
const MAX_COMFY = 1000;

/**
 * @typedef {Object} Comfy
 * @description A comfiness value associated to a certain ID and relevant for a certain date
 * @property {string} id The identifier associated to the comfiness value
 * @property {Date} date The date for which the comfiness value is relevant
 * @property {number} comfvalue The amount of comfiness which will occur for the user represented by the ID on the specified date
 */

/**
 * Grabs the comfiness value from Seb's universal comfiness forecasting API
 * @param {string} id Some sort of identifier representing the user, can be any unique value related to them
 * @param {string|number|Date} [date='tomorrow'] The date to check, supports anything that can be parsed by JavaScript's Date objects, or keywords recognized by the API
 * @returns {Comfy} The comfiness value
 */
async function getComfy(id, date = 'tomorrow') {
	const url = new URL('http://api.sebg.moe/comf/');

	if (date == null) {
		date = new Date();
	}

	const parsedDate = Date.parse(date);

	if (isNaN(parsedDate)) {
		date = String(date);
	} else {
		const dateboy = new Date(parsedDate);
		date = [
			dateboy.getFullYear(),
			dateboy.getMonth() + 1,
			dateboy.getDate()
		].join('-');
	}

	url.searchParams.set('id', id);
	url.searchParams.set('date', date);

    try {
        const data = await axios.get(`http://api.sebg.moe/comf?id=${id}&date${date}`).then(res => res.data);
        return {
            id,
            comfvalue: Number(data.comfvalue),
            date: new Date(data.date.Y, data.date.M - 1, data.date.D)
        };
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

/**
 * Generates a progression bar
 * @param {number} value Progression between 0 and 1
 * @param {number} size Size of the bar
 * @param {string[]} [chars] The characters to use, the lower the index the lower the progression
 * @returns {string} The progression bar
 */
function bar(value, size, chars = [' ', '▌', '█']) {
	let barString = '';

	for (let i = 0; i < size; i++) {
		const charProgress = (value * size) - i;
		barString +=
			chars[
				Math.min(
					chars.length - 1,
					Math.max(0, Math.floor(charProgress * chars.length))
				)
			];
	}

	return barString;
}

export default {
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const comfy = await getComfy(user.id);
    
        const rating = RATING_ARRAY[Math.floor((comfy.comfvalue / (MAX_COMFY + 1)) * RATING_ARRAY.length)];
    
        return interaction.reply({
            content: ' ',
            embeds: [fixEmbeds({
                color: 0xee6666,
                author: {
                    name: `Comfiness forecast for ${user.username}`,
                    icon_url: user.displayAvatarURL()
                },
                title: `Your forecasted comfiness for tomorrow is:`,
                fields: [{
                    name: `**__${rating}__**   (${(comfy.comfvalue / MAX_COMFY * 100).toFixed(1)} %)`,
                    value: `\`[${bar(comfy.comfvalue / MAX_COMFY, 24)}]\``
                }],
                footer: {
                    text: `Forecast for ${comfy.date.toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}  —  thx Sebberino ♥`
                }
            })]
        });
    },
    data: new SlashCommandBuilder()
        .setName('comfy')
        .setDescription("Check your comfiness for tomorrow! If you don't mention anyone")
        .addUserOption(option => {
            return option.setName('user')
                .setDescription('A user to check for comfiness instead of who calls the command')
                .setRequired(false);
        })
};
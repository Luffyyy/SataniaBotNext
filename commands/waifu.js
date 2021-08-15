import { SlashCommandBuilder } from "@discordjs/builders";
import yaml from 'js-yaml';
import fs from 'fs';
import seedrandom from "seedrandom";

const {types, ratings, cupSizes, bloodTypes} = yaml.load(fs.readFileSync('assets/waifu-const.yaml'));
const overrides = yaml.load(fs.readFileSync('assets/waifu-overrides.yaml'));

const infoMethods = {
	heightAndWeight(rnd) {
		const heightMetric = (numberModifier(rnd()) * 60) + 120;

		function height() {
			const heightImperial = Math.round(heightMetric / 2.54);

			const displayMetric = Math.round(heightMetric) + '\u2009cm';
			const displayImperial =
				Math.floor(heightImperial / 12) + '\'' +
				Math.floor(heightImperial % 12) + '"';

			return `        **Height**: ${displayMetric} / ${displayImperial}`;
		}

		function weight() {
			// Weight is calculated by aiming to obtain a realistical BMI between 17 and 24
			// The BMI is a ratio to determine if a certain weight is anormal compared to a certain height
			// A normal BMI is between 18.5-25, we just made it a little lower because waifus are thinnnnn

			const minWeight = 17 * ((heightMetric / 100) ** 2);
			const maxWeight = 24 * ((heightMetric / 100) ** 2);

			const kiloWeight = (numberModifier(rnd()) * (maxWeight - minWeight)) + minWeight;
			const poundWeight = kiloWeight * 2.2046226218;

			const displayKilo = Math.round(kiloWeight) + '\u2009kg';
			const displayPound = Math.round(poundWeight) + '\u2009lb';

			return `       **Weight**: ${displayKilo} / ${displayPound}`;
		}

		return [height(), weight()].join('\n');
	},
	bloodType(rnd) {
		const num = rnd();
		let acc = 0;

		for (const [type, val] of Object.entries(bloodTypes)) {
			acc += val;

			if (acc > num) {
				return `**Blood Type**: ${type}`;
			}
		}

		throw new Error('No appropriate blood types found.');
	},
	cupSize(rnd) {
		const cupSizeRnd = rnd();
		const cupSize = cupSizes[Math.floor(cupSizes.length * cupSizeRnd)];

		if (cupSizeRnd > 0.98) {
			return '     **Cup Size**: Too big to be measured\n';
		}

		return (
			`     **Cup Size**: '${cupSize}' in US Size ` +
			'[(?)](http://www.sizeguide.net/bra-sizes.html)\n'
		);
	}
};

function numberModifier(x) {
	// Okay I can understand that this might be really complicated : /
	// https://www.desmos.com/calculator/7bchmabdjw
	// Basically, if you pass a random value between 0 and 1 to this function,
	// it makes the ones around 0.5 more frequent and rarer around 1 and 0
	return (Math.cos((Math.cos((x + 0.5 + Math.floor(x + 0.5)) * Math.PI) + 1) * Math.PI / 2) / 2) + Math.floor(x + 0.5);
}

/**
 * Split a text every N characters, always splitting at a space
 * @param {string} str The text to split
 * @param {number} length The maximal length of every chunk
 * @returns {string[]} The splitted text
 */
function splitText(str, length) {
	const lines = str.split(/\n\r?|\r\n?/);
	const results = [];

	for (const line of lines) {
		const words = line.split(/\b(?!\W)/);

		results.push('');

		for (const word of words) {
			const newline = results[results.length - 1] + word;

			if (
				results[results.length - 1].length !== 0 &&
				newline.trim().length >= length
			) {
				results.push('');
			}

			results[results.length - 1] += word;
		}
	}

	return results.map(line => line.trim());
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
        const user = interaction.options.getUser('who') || interaction.user;
        const userRNG = seedrandom('waifu-' + user.id);

        // The type of the waifu
        let type = types[Math.floor(userRNG() * types.length)];
    
        if (user.id in overrides) {
            type = overrides[user.id];
    
            if (typeof type === 'number') {
                type = types[type];
            }
        }
    
        // The scores, we need to calculate all of them first to then divide them with their total when added
        const scores = ratings.map(() => userRNG());
        const total = scores.reduce((acc, score) => acc + score, 0);
    
        let description = `*${splitText(type.description, 40).join('\n')}*\n\n`;
    
        description += ratings
            .map((rating, i) => {
                const score = scores[i] / total;
                const displayScore = (score * 100).toFixed(1).padStart(5, ' ') + '%';
    
                // \u2060 is a Unicode Word-Joiner, allows us to avoid whitespace trimming
                return `**${rating}**: \`\u2060${displayScore} [${bar(score, 15)}]\``;
            })
            .join('\n');
    
        // Unicode Word-Joiner, same as above
        const infos =
            '\u2060' +
            [...Object.values(infoMethods)]
                .map(method => method(userRNG))
                .join('\n');
    
        return interaction.reply({
            content: ' ',
            embeds: [{
                title: `Waifu Type: __${type.name}__`,
                description,
                author: {
                    name: `Waifu ratings for ${user.username}`,
                    icon_url: user.displayAvatarURL()
                },
                fields: [
                    {
                        name: 'Information',
                        value: infos
                    }
                ]
            }]
        });
    },
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Get the waifu stats of you, or someone else!')
        .addUserOption(option => {
            return option.setName('who')
                .setDescription('Check someone other than yourself')
                .setRequired(false);
        })
};
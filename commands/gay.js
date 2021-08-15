import { SlashCommandBuilder } from "@discordjs/builders";
import seedrandom from "seedrandom";
import yaml from 'js-yaml';
import fs from 'fs';

const overrides = yaml.load(fs.readFileSync('assets/gay-overrides.yaml'));

function numberModifier(x) {
    return (Math.cos((x + 1) * Math.PI) * 0.5) + 0.5;
}

function activityModifier(x) {
    return Math.cos((Math.cos((x + 1) * Math.PI / 2) + 1) * Math.PI / 2);
}

function bar(value, size) {
    const barString = '─'.repeat(size).split('');
    barString[Math.round(value * size)] = '⦿';
    return barString.join('');
}

function percent(value) {
    return (value * 100).toFixed(1) + '%';
}

export default {
    async execute(interaction) {
        const user = interaction.options.getUser('who') || interaction.user;
    
        const userRNG = seedrandom(user.id);
        let gay = numberModifier(userRNG());
        let activity = activityModifier(userRNG());
    
        let override = {};
    
        if (user.id in overrides) {
            override = overrides[user.id];
        }
    
        console.dir(override);
    
        if ('gay' in override) {
            gay = override.gay;
        }
    
        if ('activity' in override) {
            activity = override.activity;
        }
    
        let straight = 1 - gay;
        const orientation = (gay + (1 - straight)) / 2;
    
        gay *= activity;
        straight *= activity;
    
        const ratingArray = [
            'VERY Straight',
            'Pretty Straight',
            'A Little Straight',
            'Bisexual But Also A Little Straight',
            'Bisexual',
            'Bisexual But Also A Little Gay',
            'A Little Gay',
            'Pretty Gay',
            'VERY Gay'
        ];
    
        let rating = ratingArray[Math.floor(orientation * ratingArray.length)];
    
        if (activity < 0.3) {
            rating = 'Asexual';
        }
    
        if ('rating' in override) {
            rating = override.rating;
        }
    
        return interaction.reply({
            content: ' ',
            embeds: [{
                title: `Rating: __${rating}__`,
                color: 0xee6666,
                author: {
                    name: `Gay ratings for ${user.username}`,
                    icon_url: user.displayAvatarURL() // eslint-disable-line camelcase
                },
                fields: [
                    {
                        name: '  Orientation:',
                        value: `**Straight:** ${percent(straight)} | **Gay:** ${percent(gay)} | **Asexuality:** ${percent(1 - activity)} \n \`${bar(orientation, 24)}\`\n` +
                            `◂ Straight${'\u2003'.repeat(5)}Gay ▸`
                    },
                    {
                        name: 'Sexual Activity:',
                        value: `\`${bar(activity, 24)}\`\n◂ Low${'\u2003'.repeat(6)}High ▸`
                    }
                ]
            }]
        });
    },
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription('Check how gay someone is!')
        .addUserOption(option => {
            return option.setName('who')
                .setDescription('Check someone other than yourself')
                .setRequired(true);
        })
};
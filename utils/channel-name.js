import { User, Channel } from 'discord.js';
import nick from './nick.js';

/**
 * Returns the displayed name of a channel
 * @param {Discord.Channel|Discord.User} channel The channel to get the name of
 * @returns {string} The displayed name of the channel
 */
export function channelName(channel) {
	if (channel instanceof User) {
		return channel.username;
	}

	if (!(channel instanceof Channel)) {
		throw new TypeError(
			'The \'channel\' argument must be an instance of a Discord Channel'
		);
	}

	switch (channel.type) {
		case 'dm':
			return channel.recipient.username;

		case 'group':
			if (channel.name === null) {
				const name = channel.recipients
					.filter(user => user.id !== channel.client.user.id)
					.map(user => nick(user, channel))
					.join(', ');

				return name || 'Unnamed';
			}
			// Falls through if it has a name

		case 'text':
		case 'voice':
		case 'category':
			return channel.name;

		default:
			throw new TypeError('Unknown channel type');
	}
}

export function channelIcon(channel) {
	switch (channel.type) {
		case 'dm':
			return channel.recipient.displayAvatarURL;

		case 'group':
			return (
				channel.iconURL ||
				'https://discordapp.com/assets/f046e2247d730629309457e902d5c5b3.svg'
			);

		case 'text':
		case 'voice':
		case 'category':
			return channel.guild.iconURL;

		default:
			throw new TypeError('Unknown channel type');
	}
}
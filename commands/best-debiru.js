const trigger = /^(good|best|great|nice|cool(est)?)\s+(bot|girl|demon|waifu|akuma|devil|debiru)\s*!*$/i;

export default {
    async tryExecute(message) {
        const messageCache = message.channel.messages.cache;
        const channelMessagesID = [...messageCache.keys()];
        const lastMessageIndex = channelMessagesID[channelMessagesID.indexOf(message.id) - 1];
    
        if (!lastMessageIndex) {
            return false;
        }
    
        const lastMessage = messageCache.get(lastMessageIndex);
    
        if (lastMessage.author.id === message.author.id) {
            await message.react('♥');
        }
        return true;
    },
    trigger
};
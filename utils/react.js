import { sleep } from "./sleep.js";

export async function react(client, message, trigger, reactWith) {
    let cancelled = false;
    async function handleEdit(_, newMessage) {
        if (newMessage.id === message.id && !trigger.test(newMessage.content)) {
            try {
                cancelled = true;
                await newMessage.reactions.removeAll();
            } catch (error) {
                await message.reply("I'm not able to remove reactions. Please check the permissions");
            }
        } else {
            client.once('messageUpdate', handleEdit);
        }
    }
    // Listen to any edit to combat abuse of the command
    client.once('messageUpdate', handleEdit);
    
    await sleep(150);

    for (const react of reactWith) {
        try {
            if (!cancelled) {
                await message.react(react);
            } else {
                break;
            }
        } catch (error) {
            await message.reply('I seem to not be able to react! Please check the permissions');
            return;
        }
    }
}
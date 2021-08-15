import reg from "../utils/reg.js";
import { sataniaName, extra } from '../utils/satania-name.js';
import { react } from "../utils/react.js";

const sentences = [
	reg`(praise|praise be|just|love|(all\s*)?h(a|e)il)?\s*${sataniaName}`, // English
	reg`${sataniaName}\s*(praise|love|(all\s*)?h(a|e)il)?\s*`,
	reg`${sataniaName}\s*(the\s*)?best\s*((girl|debiru|devil|demon|(dai)?akuma)\s*)?`,
	reg`${sataniaName}${/(((のこと|の事)?(は|が)?((だい)?すき|大?好き|世界一|一番|かわいい|可愛い|最高)(だ|です)?)|を?褒めて(ください)?)?/}${/よ?ね?/}`, // Japanese
	reg`Слава\s*${sataniaName}`, // Russian
	reg`(Sauda(ç|c)(õ|o)es\s*a|a(ç|c)ai|salve|gloire?\s*(à|a)|(alaben|rezen|diosa)\s*a?)\s*${sataniaName}` // Portuguese, Spanish, and Italian
];

const trigger = reg.i`^(${extra}${sentences}${extra})$`;
const reactWith = ['🇵', '🇷', '🇮', '🇦', '🇸', '🇪'];

export default {
    async tryExecute(message, client) {
        if (client.guilds.cache.has('310180409541394432')) {
            const emojis = client.guilds.cache.get('310180409541394432').emojis;
            reactWith.push(emojis.filter(value => value.name.replace(/^gif/, '').startsWith('Satania')).random());
        }    

        await react(client, message, trigger, reactWith);

        return true;
    },
    trigger
};
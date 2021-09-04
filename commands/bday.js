import dayjs from "dayjs";
import reg from "../utils/reg.js";
import {sataniaName, extra} from "../utils/satania-name.js";
import { react } from "../utils/react.js";

const happyBirthday = /happy\s*(birthday|bday|day\s*of\s*(the)?\s*birth)/;
const tanjoubiOmedetou = /(お?(たんじょうび|誕生日)おめでとう(ございます|です)?)/;
const frenchBirthday = /(joyeu(x|se)?|bon(ne)?)\s*(ann?iv(erss?aire?)?|f[êe]te)s?/;
const spanishBirthday = /feliz\s*(cumplea[ñn]os|cumple)/;
const portugueseBirthday = /(feliz\s*anivers[áa]rio)|Parab[ée]ns/;

const sentences = [
	reg`${happyBirthday},?\s*${sataniaName}`, // English
	reg`${sataniaName},?\s*${happyBirthday}`,
	reg`${sataniaName}、?${tanjoubiOmedetou}${/よ?ね?/}`, // Japanese
	reg`${tanjoubiOmedetou}、?${sataniaName}`,
	reg`${spanishBirthday},?${sataniaName}`, // Spanish
	reg`${sataniaName},?${spanishBirthday}`,
	reg`${frenchBirthday},?\s*${sataniaName}`, // French
	reg`${sataniaName},?\s*${frenchBirthday}`,
	reg`${portugueseBirthday},?\s*${sataniaName}`, // Portuguese
	reg`${sataniaName},?\s*${portugueseBirthday}`
];

const trigger = reg.i`^(${extra}${sentences}${extra})$`;
const reactWith = ['876101274104373298', '🎉', '🎂'];

export default {
    async execute(message, client) {
        const day = dayjs().date();
        if (!dayjs().month() === 7 || day < 14 || day > 16) {
            return false;
        }
    
        await react(client, message, trigger, reactWith);

        return true;
    },
    trigger
};
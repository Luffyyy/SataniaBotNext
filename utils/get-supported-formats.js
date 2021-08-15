import sharp from "sharp";

const formatMimes = {
	webp: 'image/webp',
	jpeg: 'image/jpeg',
	png: 'image/png',
	apng: 'image/png',
	svg: 'image/svg+xml',
	gif: 'image/gif',
	tiff: 'image/tiff',
	pdf: 'application/pdf'
};

const supportedFormats = [];

for (const key of Object.keys(sharp.format)) {
    const current = sharp.format[key];
    if (current.input.buffer && current.id in formatMimes) {
        supportedFormats.push(formatMimes[current.id]);
    }
}

export default supportedFormats;
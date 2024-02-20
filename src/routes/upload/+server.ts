import type { RequestHandler } from './$types';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const COLOR_REGEX = /^#[0-9a-f]{6}$/;

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const file = formData.get('file');
	if (!file || !(file instanceof Blob) || file.size === 0) {
		return new Response('No file found', { status: 400 });
	}

	const color = formData.get('color');
	if (!color || typeof color !== 'string' || !COLOR_REGEX.test(color)) {
		return new Response('No color found', { status: 400 });
	}

	const buffer = await file.arrayBuffer();

	const image = await loadImage(new Uint8Array(buffer));

	const imageWidth = 1000;
	const imageHeight = 1000;

	const canvas = createCanvas(imageWidth, imageHeight);

	const ctx = canvas.getContext('2d');
	ctx.fillStyle = color;

	const width = image.width;
	const height = image.height;
	const aspect = width / height;
	let newWidth = imageWidth;
	let newHeight = imageHeight;

	if (aspect > 1) {
		newHeight = newWidth / aspect;
	} else {
		newWidth = newHeight * aspect;
	}

	ctx.fillRect(0, 0, imageWidth, imageHeight);
	ctx.drawImage(
		image,
		(imageWidth - newWidth) / 2,
		(imageHeight - newHeight) / 2,
		newWidth,
		newHeight
	);

	const buffer2 = canvas.toBuffer('image/png');

	return new Response(buffer2, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};

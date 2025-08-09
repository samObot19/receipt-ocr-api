
const allowedImageMimeTypes = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/bmp',
	'image/webp',
	'image/tiff',
	'image/svg+xml',
];

export function isImageMimeType(mimeType: string): boolean {
	return allowedImageMimeTypes.includes(mimeType.toLowerCase());
}

const allowedImageExtensions = [
	'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'
];

export function isImageFileExtension(filename: string): boolean {
	return allowedImageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

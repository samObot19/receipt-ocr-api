
export function toIsoString(date: Date): string {
	return date.toISOString();
}

export function toReadableDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	});
}

export function toReadableDateTime(date: Date): string {
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
}

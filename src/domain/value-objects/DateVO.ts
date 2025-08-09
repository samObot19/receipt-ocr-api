
export class DateVO {
	private readonly value: Date;

	constructor(date: string | Date) {
		const parsed = typeof date === 'string' ? new Date(date) : date;
		if (isNaN(parsed.getTime())) {
			throw new Error('Invalid date value');
		}
		this.value = parsed;
	}

	toDate(): Date {
		return this.value;
	}

	toISOString(): string {
		return this.value.toISOString();
	}

	toString(): string {
		return this.value.toString();
	}
}

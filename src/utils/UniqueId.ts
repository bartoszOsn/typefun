export class UniqueId {
	private static nextId = 0;

	public static get() {
		return new UniqueId(this.nextId++);
	}

	private constructor(private readonly id: number) {}

	public toString() {
		return `[UniqueId ${this.id}]`;
	}

	public equals(other: UniqueId): boolean {
		return this.id === other.id;
	}

	public internal(): number {
		return this.id;
	}
}
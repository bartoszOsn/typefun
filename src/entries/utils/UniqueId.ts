export class UniqueId {

	private static nextId = 0;

	private constructor(private readonly id: number) {}

	public static get(): UniqueId {
		return new UniqueId(this.nextId++);
	}

	public toString(): string {
		return `[UniqueId ${this.id}]`;
	}

	public equals(other: UniqueId): boolean {
		return this.id === other.id;
	}

	public internal(): number {
		return this.id;
	}
}

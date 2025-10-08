export interface Item {
	id: string;
	title: string;
	content: string;
	created: Date;
	updated: Date;
}

export interface ItemListResult {
	items: Item[];
	nextCursor: number | null;
}

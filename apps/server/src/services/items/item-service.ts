import { nanoid } from "nanoid";
import type { Item, ItemListResult } from "@/server/domain/items";
import type { ItemRepository } from "@/server/repositories/do/item-repository";

export class ItemService {
	constructor(private readonly repository: ItemRepository) {}

	async listItems(limit?: number, cursor?: number): Promise<ItemListResult> {
		return await this.repository.listItems(limit, cursor);
	}

	async getItem(itemId: string): Promise<Item | null> {
		return await this.repository.getItem(itemId);
	}

	async createItem(title: string, content: string): Promise<Item> {
		const itemId = nanoid();
		return await this.repository.createItem(itemId, title, content);
	}

	async updateItem(
		itemId: string,
		title: string,
		content: string,
	): Promise<Item> {
		return await this.repository.updateItem(itemId, title, content);
	}

	async deleteItem(itemId: string): Promise<{ id: string }> {
		return await this.repository.deleteItem(itemId);
	}
}

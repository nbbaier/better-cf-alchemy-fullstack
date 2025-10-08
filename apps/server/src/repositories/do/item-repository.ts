import type { Item, ItemListResult } from "@/server/domain/items";
import type { UserDurableObject } from "@/server/infra/do/user-durable-object";

export class ItemRepository {
	constructor(private readonly stub: DurableObjectStub<UserDurableObject>) {}

	async listItems(limit = 100, cursor?: number): Promise<ItemListResult> {
		return await this.stub.listItems(limit, cursor);
	}

	async getItem(itemId: string): Promise<Item | null> {
		return await this.stub.getItem(itemId);
	}

	async createItem(
		itemId: string,
		title: string,
		content: string,
	): Promise<Item> {
		return await this.stub.createItem(itemId, title, content);
	}

	async updateItem(
		itemId: string,
		title: string,
		content: string,
	): Promise<Item> {
		return await this.stub.updateItem(itemId, title, content);
	}

	async deleteItem(itemId: string): Promise<{ id: string }> {
		return await this.stub.deleteItem(itemId);
	}
}

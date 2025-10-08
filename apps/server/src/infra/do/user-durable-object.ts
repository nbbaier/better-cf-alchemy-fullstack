import { DurableObject } from "cloudflare:workers";
import { desc, eq, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import type { Item, ItemListResult } from "@/server/domain/items";
// @ts-expect-error - generated JS file has no types
import migrations from "./migrations/migrations.js";
import * as schema from "./schema/chat";

export class UserDurableObject extends DurableObject<Env> {
	private readonly db: ReturnType<typeof drizzle>;
	private readonly userId: string;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		const durableObjectId = ctx.id.toString();
		const maybeName = (ctx.id as { name?: string | null }).name;
		this.userId =
			typeof maybeName === "string" && maybeName.length > 0
				? maybeName
				: durableObjectId;
		this.db = drizzle(ctx.storage, { schema, logger: false });

		ctx.blockConcurrencyWhile(async () => {
			try {
				await migrate(this.db, migrations);
			} catch (error) {
				console.error("user-do migrate failed", {
					userId: this.userId,
					error,
				});
				throw error;
			}
		});
	}

	async runMigrations() {
		await migrate(this.db, migrations);
		return { status: "ok" } as const;
	}

	async listItems(limit = 100, cursor?: number): Promise<ItemListResult> {
		const cappedLimit = Math.min(limit, 200);
		const condition = cursor
			? lt(schema.items.created, new Date(cursor))
			: undefined;

		const rows = await this.db
			.select()
			.from(schema.items)
			.where(condition)
			.orderBy(desc(schema.items.created))
			.limit(cappedLimit);

		const nextCursor =
			rows.length === cappedLimit
				? rows[rows.length - 1]?.created instanceof Date
					? rows[rows.length - 1]?.created.getTime()
					: Number(rows[rows.length - 1]?.created) || null
				: null;

		return {
			items: rows,
			nextCursor,
		};
	}

	async getItem(itemId: string): Promise<Item | null> {
		const row = await this.db
			.select()
			.from(schema.items)
			.where(eq(schema.items.id, itemId))
			.get();
		return row ?? null;
	}

	async createItem(
		itemId: string,
		title: string,
		content: string,
	): Promise<Item> {
		const now = new Date();
		const item = {
			id: itemId,
			title,
			content,
			created: now,
			updated: now,
		};
		await this.db.insert(schema.items).values(item);
		return item;
	}

	async updateItem(
		itemId: string,
		title: string,
		content: string,
	): Promise<Item> {
		const now = new Date();
		await this.db
			.update(schema.items)
			.set({ title, content, updated: now })
			.where(eq(schema.items.id, itemId));

		const updated = await this.getItem(itemId);
		if (!updated) {
			throw new Error("Item not found after update");
		}
		return updated;
	}

	async deleteItem(itemId: string): Promise<{ id: string }> {
		await this.db.delete(schema.items).where(eq(schema.items.id, itemId));
		return { id: itemId };
	}
}
